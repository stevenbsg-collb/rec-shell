import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Title,
  Paper,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  ThemeIcon,
  RingProgress,
  Select,
  SimpleGrid,
  Tabs,
  Alert,
  Progress,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  LabelList,
} from "recharts";
import { TrendingUp, Activity, Clock, BarChart3, Leaf, CheckCircle } from "lucide-react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { useAnalisisImagen } from "../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl";
import { usePlanesTratamiento } from "../../UI_ANALISIS_IMAGEN/hooks/useAgricultura";

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe"];

const soloFecha = (f?: string) => {
  if (!f) return "";
  return f.includes("T") ? f.split("T")[0] : f.split(" ")[0];
};

const parseFecha = (f?: string) => {
  if (!f) return null;
  const iso = f.includes("T") ? f : f.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

const normalizarSeveridad = (tipo?: string | null) => {
  if (!tipo) return null;
  const v = String(tipo).toLowerCase().trim();

  if (v.includes("alta") || v.includes("high") || v.includes("critical") || v.includes("error")) return "alta";
  if (v.includes("media") || v.includes("medium") || v.includes("warning")) return "media";
  if (v.includes("baja") || v.includes("low") || v.includes("info")) return "baja";

  return null;
};

const isAdminFromSession = () => {
  try {
    const raw = window.sessionStorage.getItem("user");
    if (!raw) return false;
    const u = JSON.parse(raw);

    const roles: string[] = Array.isArray(u?.roles) ? u.roles : [];
    const single = String(u?.role ?? u?.rol ?? u?.perfil ?? u?.tipo ?? "");
    const all = [...roles.map(String), single].join(" ").toUpperCase();

    return all.includes("ADMIN");
  } catch {
    return false;
  }
};

const fmtShort = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-ES", { month: "short", day: "numeric" });

const buildDateKeys = (days: number) => {
  const out: string[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
};

const buildDateKeysBetween = (start: Date, end: Date) => {
  const out: string[] = [];
  const s = new Date(start);
  const e = new Date(end);

  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);

  if (s > e) {
    const tmp = new Date(s);
    s.setTime(e.getTime());
    e.setTime(tmp.getTime());
  }

  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
};

/** ✅ helpers para extraer userId */
const getUserIdFromPlan = (p: any) => {
  const candidates = [
    p?.usuarioId,
    p?.userId,
    p?.usuario_id,
    p?.user_id,
    p?.analisis?.usuarioId,
    p?.analisis?.userId,
    p?.analisis?.usuario_id,
    p?.analisis?.user_id,
    p?.usuario?.id,
    p?.user?.id,
  ];
  for (const c of candidates) if (c !== null && c !== undefined && c !== "") return c;
  return null;
};

const getUserIdFromAnalisis = (a: any) => {
  const candidates = [a?.usuarioId, a?.userId, a?.usuario_id, a?.user_id, a?.usuario?.id, a?.user?.id];
  for (const c of candidates) if (c !== null && c !== undefined && c !== "") return c;
  return null;
};

const getPlanKey = (p: any) => {
  return (
    p?.id ??
    p?.planId ??
    p?.plan_id ??
    p?.uuid ??
    p?.analisisId ??
    p?.analisis_id ??
    p?.analysisId ??
    p?.analysis_id ??
    null
  );
};

type PeriodSeveridad = "7d" | "30d" | "90d" | "range";
type RangeValue = [Date | null, Date | null];

export function DashboardAdminM1() {
  const [periodSeveridad, setPeriodSeveridad] = useState<PeriodSeveridad>("7d");
  const [rangeSeveridad, setRangeSeveridad] = useState<RangeValue>([null, null]);

  const isAdmin = useMemo(() => isAdminFromSession(), []);

  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const { loading: loadingPlanes, listaPlanes, obtenerTodosPlanes } = usePlanesTratamiento();

  const [planesFetchError, setPlanesFetchError] = useState<string | null>(null);

  // ✅ selector admin (entre users)
  const [selectedUserId, setSelectedUserId] = useState<string>("all");

  const obtenerRef = useRef(OBTENER);
  const obtenerPlanesRef = useRef(obtenerTodosPlanes);

  useEffect(() => {
    obtenerRef.current = OBTENER;
  }, [OBTENER]);

  useEffect(() => {
    obtenerPlanesRef.current = obtenerTodosPlanes;
  }, [obtenerTodosPlanes]);

  useEffect(() => {
    obtenerRef.current?.();
  }, [isAdmin]);

  useEffect(() => {
    setPlanesFetchError(null);
    Promise.resolve(obtenerPlanesRef.current?.()).catch((e) => setPlanesFetchError(String(e)));
  }, [isAdmin]);

  const data = useMemo(() => {
    const arr = [...(analisisList ?? [])];
    arr.sort((a: any, b: any) => {
      const ta = parseFecha(a?.fecha)?.getTime() ?? 0;
      const tb = parseFecha(b?.fecha)?.getTime() ?? 0;
      return tb - ta;
    });
    return arr;
  }, [analisisList]);

  const planes = listaPlanes ?? [];

  /** ✅ Opciones de usuarios (solo admin) */
  const userOptions = useMemo(() => {
    if (!isAdmin) return [];

    const idsFromAnalisis = data
      .map((a: any) => getUserIdFromAnalisis(a))
      .filter((x: any) => x !== null && x !== undefined && x !== "")
      .map((x: any) => String(x));

    const idsFromPlanes = planes
      .map((p: any) => getUserIdFromPlan(p))
      .filter((x: any) => x !== null && x !== undefined && x !== "")
      .map((x: any) => String(x));

    const uniqueIds = Array.from(new Set([...idsFromAnalisis, ...idsFromPlanes]));

    const sortedIds = uniqueIds.sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return [{ value: "all", label: "Todos los usuarios" }, ...sortedIds.map((id) => ({ value: id, label: `Usuario ${id}` }))];
  }, [data, planes, isAdmin]);

  /** ✅ Filtrado por usuario */
  const dataFiltrada = useMemo(() => {
    if (!isAdmin) return data;
    if (selectedUserId === "all") return data;
    return data.filter((a: any) => String(getUserIdFromAnalisis(a) ?? "") === String(selectedUserId));
  }, [data, isAdmin, selectedUserId]);

  const planesFiltrados = useMemo(() => {
    if (!isAdmin) return planes;
    if (selectedUserId === "all") return planes;
    return planes.filter((p: any) => String(getUserIdFromPlan(p) ?? "") === String(selectedUserId));
  }, [planes, isAdmin, selectedUserId]);

  /* ================= KPIs ================= */
  const totalAnalisis = dataFiltrada.length;

  const analisisValidos = dataFiltrada.filter((a: any) => a.es_valido === true).length;

  const totalDetecciones = useMemo(() => {
    return dataFiltrada.reduce((s: number, a: any) => {
      const n = a.estadisticas?.total_detecciones ?? a.detecciones?.length ?? 0;
      return s + n;
    }, 0);
  }, [dataFiltrada]);

  const promedioConfianza = useMemo(() => {
    if (!analisisValidos) return "0.0";
    const sum = dataFiltrada
      .filter((a: any) => a.es_valido === true)
      .reduce((s: number, a: any) => s + (a.estadisticas?.confianza_promedio ?? 0), 0);
    return (sum / analisisValidos).toFixed(1);
  }, [dataFiltrada, analisisValidos]);

  const planesGenerados = useMemo(() => {
    const keys = new Set(
      (planesFiltrados as any[])
        .map((p) => getPlanKey(p))
        .filter((k) => k !== null && k !== undefined)
        .map((k) => String(k))
    );
    return keys.size > 0 ? keys.size : (planesFiltrados?.length ?? 0);
  }, [planesFiltrados]);

  const pctPlanes = totalAnalisis ? Math.min(100, (planesGenerados / totalAnalisis) * 100) : 0;

  /* ================= DEFICIENCIAS POR TIPO ================= */
  const chartDeficiencias = useMemo(() => {
    const porTipo: Record<string, number> = {};

    for (const a of dataFiltrada as any[]) {
      if (a.es_valido !== true) continue;

      const por_tipo = a.estadisticas?.por_tipo;
      if (por_tipo && Object.keys(por_tipo).length) {
        Object.entries(por_tipo).forEach(([k, v]) => {
          porTipo[k] = (porTipo[k] || 0) + Number(v);
        });
      } else if (Array.isArray(a.detecciones) && a.detecciones.length) {
        for (const det of a.detecciones) {
          const key = (det as any)?.deficiencia ?? "Desconocida";
          porTipo[key] = (porTipo[key] || 0) + 1;
        }
      }
    }

    return Object.entries(porTipo).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  }, [dataFiltrada]);

  /* ================= ALERTA 90 DÍAS ================= */
  const totalDef90 = useMemo(() => {
    const hoy = new Date();
    const hace90 = new Date();
    hace90.setDate(hoy.getDate() - 90);

    return dataFiltrada
      .filter((a: any) => a.es_valido === true && a.fecha)
      .filter((a: any) => {
        const dt = parseFecha(a.fecha);
        return dt ? dt >= hace90 : false;
      })
      .reduce((s: number, a: any) => s + (a.estadisticas?.total_detecciones ?? a.detecciones?.length ?? 0), 0);
  }, [dataFiltrada]);

  /* ================= SEVERIDAD TIEMPO ================= */
  const chartSeveridadTiempo = useMemo(() => {
    let keys: string[] = [];

    if (periodSeveridad === "range") {
      const [start, end] = rangeSeveridad;
      if (!start || !end) return [];
      keys = buildDateKeysBetween(start, end);
    } else {
      const days = periodSeveridad === "7d" ? 7 : periodSeveridad === "30d" ? 30 : 90;
      keys = buildDateKeys(days);
    }

    const acc: Record<string, { fecha: string; alta: number; media: number; baja: number; total: number }> = {};
    keys.forEach((k) => (acc[k] = { fecha: k, alta: 0, media: 0, baja: 0, total: 0 }));

    for (const a of dataFiltrada as any[]) {
      if (a.es_valido !== true || !a.fecha) continue;

      const f = soloFecha(a.fecha);
      if (!f || !acc[f]) continue;

      const cantidadDef = a.estadisticas?.total_detecciones ?? a.detecciones?.length ?? 0;
      if (!cantidadDef) continue;

      const sev = normalizarSeveridad(a.tipo_alerta) ?? "media";
      acc[f][sev] += cantidadDef;
      acc[f].total += cantidadDef;
    }

    return keys.map((k) => acc[k]);
  }, [dataFiltrada, periodSeveridad, rangeSeveridad]);

  const diaMasCritico = useMemo(() => {
    if (!chartSeveridadTiempo.length) return null;
    return chartSeveridadTiempo.reduce((max, cur) => (cur.total > max.total ? cur : max));
  }, [chartSeveridadTiempo]);

  /* ================= ESTADOS ================= */
  if (loading || loadingPlanes) return <Alert color="blue">Cargando datos…</Alert>;
  if (error) return <Alert color="red">{String(error)}</Alert>;
  if (planesFetchError) return <Alert color="red">{planesFetchError}</Alert>;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Dashboard de Análisis de Deficiencias
          </Title>
          <Text c="dimmed" size="lg">
            Monitoreo y análisis de cultivos de cacao
          </Text>
        </div>



        {totalDef90 > 0 && (
          <Alert
            variant="light"
            color={totalDef90 > 50 ? "red" : totalDef90 > 20 ? "orange" : "yellow"}
            icon={<Activity size={16} />}
          >
            En los últimos <b>90 días</b> se detectaron <b>{totalDef90}</b> deficiencias.
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Análisis
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {totalAnalisis}
                </Text>
                <Text size="xs" c="teal" mt={4}>
                  {analisisValidos} válidos
                </Text>
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="blue">
                <BarChart3 size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Planes Generados
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {planesGenerados}
                </Text>
                <Progress value={pctPlanes} mt="xs" size="sm" color="teal" />
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="teal">
                <CheckCircle size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Detecciones
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {totalDetecciones}
                </Text>
                <Text size="xs" c="orange" mt={4}>
                  {chartDeficiencias.length} tipos únicos
                </Text>
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="orange">
                <Leaf size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Confianza Promedio
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {promedioConfianza}%
                </Text>
                <RingProgress size={50} thickness={4} sections={[{ value: parseFloat(promedioConfianza), color: "violet" }]} mt="xs" />
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="violet">
                <TrendingUp size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        <Tabs defaultValue="deficiencias" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="deficiencias" leftSection={<Leaf size={16} />}>
              Análisis de Deficiencias
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="deficiencias" pt="xl">
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper shadow="xs" p="md" withBorder>
                  <Title order={3} mb="md">
                    Deficiencias Detectadas por Tipo
                  </Title>

                  {chartDeficiencias.length === 0 ? (
                    <Alert color="yellow">No hay datos para mostrar.</Alert>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartDeficiencias}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cantidad" fill="#4ecdc4" name="Cantidad">
                          <LabelList dataKey="cantidad" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper shadow="xs" p="md" withBorder>
                  <Title order={3} mb="md">
                    Distribución de Deficiencias
                  </Title>

                  {chartDeficiencias.length === 0 ? (
                    <Alert color="yellow">No hay datos para mostrar.</Alert>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartDeficiencias}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(p: any) => `${p.payload.nombre} ${(p.percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          dataKey="cantidad"
                        >
                          {chartDeficiencias.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Paper>
              </Grid.Col>

              <Grid.Col span={12}>
                <Paper shadow="xs" p="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Title order={3}>Deficiencias por Severidad</Title>
                      {diaMasCritico && (
                        <Text c="dimmed" size="sm">
                          Día con más deficiencias: <b>{diaMasCritico.fecha}</b> ({diaMasCritico.total})
                        </Text>
                      )}
                    </div>

                    <Group>
                      <Select
                        value={periodSeveridad}
                        onChange={(v) => v && setPeriodSeveridad(v as PeriodSeveridad)}
                        data={[
                          { value: "7d", label: "Últimos 7 días" },
                          { value: "30d", label: "Últimos 30 días" },
                          { value: "90d", label: "Últimos 90 días" },
                          { value: "range", label: "Rango (personalizado)" },
                        ]}
                        style={{ width: 220 }}
                      />

                      {periodSeveridad === "range" && (
                        <DatePickerInput
                          type="range"
                          value={rangeSeveridad}
                          onChange={setRangeSeveridad}
                          placeholder="Desde - Hasta"
                          radius="xl"
                          size="lg"
                          clearable
                          icon={<Clock size={16} />}
                          popoverProps={{ shadow: "xl", radius: "lg", withinPortal: true }}
                          maxDate={new Date()}
                        />
                      )}
                    </Group>
                  </Group>

                  {chartSeveridadTiempo.length === 0 ? (
                    <Alert color="yellow">No hay datos para graficar.</Alert>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartSeveridadTiempo}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" tickFormatter={fmtShort} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="alta" stackId="1" stroke="#ff6b6b" fill="#ff6b6b" name="Alta" />
                        <Area type="monotone" dataKey="media" stackId="1" stroke="#f9ca24" fill="#f9ca24" name="Media" />
                        <Area type="monotone" dataKey="baja" stackId="1" stroke="#6c5ce7" fill="#6c5ce7" name="Baja" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
