import React, { useState, useRef, useEffect } from 'react';
import {
  ActionIcon,
  Box,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Transition,
  Avatar,
  Group,
  ThemeIcon,
  Loader,
} from '@mantine/core';
import { IconMessageCircle, IconX, IconSend, IconRobot, IconUser } from '@tabler/icons-react';
import { useGemini } from '../gemini_IA/hooks/useGemini';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const ChatbotAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const viewport = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { loading, generateText } = useGemini({
    onSuccess: (text: string) => {
      const botMessage: Message = {
        id: Date.now(),
        text,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (err: unknown) => {
      const errorMessage: Message = {
        id: Date.now(),
        text: '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    await generateText(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Botón flotante */}
      <ActionIcon
        size={60}
        radius="xl"
        variant="filled"
        color="blue"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IconX size={28} /> : <IconMessageCircle size={28} />}
      </ActionIcon>

      {/* Ventana del chat */}
      <Transition mounted={isOpen} transition="slide-up" duration={300} timingFunction="ease">
        {(styles) => (
          <Paper
            shadow="xl"
            radius="lg"
            style={{
              ...styles,
              position: 'fixed',
              bottom: 90,
              right: 20,
              width: 380,
              height: 550,
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '16px',
                color: 'white',
              }}
            >
              <Group justify="space-between">
                <Group gap="sm">
                  <ThemeIcon size={40} radius="xl" color="white" variant="light">
                    <IconRobot size={24} />
                  </ThemeIcon>
                  <div>
                    <Text size="lg" fw={600}>Asistente Virtual</Text>
                    <Text size="xs" opacity={0.9}>Siempre disponible</Text>
                  </div>
                </Group>
              </Group>
            </Box>

            {/* Mensajes */}
            <ScrollArea
              style={{ flex: 1, padding: '16px' }}
              viewportRef={viewport}
              type="hover"
            >
              <Stack gap="md">
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Group
                      gap="xs"
                      align="flex-start"
                      style={{
                        maxWidth: '80%',
                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar
                        size={32}
                        radius="xl"
                        color={message.sender === 'user' ? 'blue' : 'violet'}
                      >
                        {message.sender === 'user' ? (
                          <IconUser size={18} />
                        ) : (
                          <IconRobot size={18} />
                        )}
                      </Avatar>
                      <Box>
                        <Paper
                          p="sm"
                          radius="md"
                          style={{
                            backgroundColor: message.sender === 'user' ? '#667eea' : '#f1f3f5',
                            color: message.sender === 'user' ? 'white' : 'black',
                          }}
                        >
                          <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.text}
                          </Text>
                        </Paper>
                        <Text
                          size="xs"
                          c="dimmed"
                          mt={4}
                          style={{
                            textAlign: message.sender === 'user' ? 'right' : 'left',
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </Text>
                      </Box>
                    </Group>
                  </Box>
                ))}
                {loading && (
                  <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Group gap="xs">
                      <Avatar size={32} radius="xl" color="violet">
                        <IconRobot size={18} />
                      </Avatar>
                      <Paper p="sm" radius="md" style={{ backgroundColor: '#f1f3f5' }}>
                        <Loader size="sm" />
                      </Paper>
                    </Group>
                  </Box>
                )}
              </Stack>
            </ScrollArea>

            {/* Input */}
            <Box
              style={{
                padding: '12px',
                borderTop: '1px solid #e9ecef',
                backgroundColor: 'white',
              }}
            >
              <Group gap="xs" align="flex-end">
                <Textarea
                  ref={inputRef}
                  placeholder="Escribe tu mensaje..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.currentTarget.value)}
                  onKeyDown={handleKeyPress}
                  autosize
                  minRows={1}
                  maxRows={3}
                  disabled={loading}
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      borderRadius: '20px',
                    },
                  }}
                />
                <ActionIcon
                  size={38}
                  radius="xl"
                  variant="filled"
                  color="blue"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <IconSend size={18} />
                </ActionIcon>
              </Group>
            </Box>
          </Paper>
        )}
      </Transition>
    </>
  );
};