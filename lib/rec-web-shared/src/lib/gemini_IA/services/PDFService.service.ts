import { generateQuestionsPrompt, generateSummaryPrompt, GENERATION_CONFIGS } from "../prompts/prompts.util";
import { service } from "../services/geminiService.service";

class PDFService {

  async pdfToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:application/pdf;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Genera un resumen del PDF usando Gemini AI
   */
  async summarizePDF(file: File): Promise<string> {
    const pdfBase64 = await this.pdfToBase64(file);
    const prompt = generateSummaryPrompt();
    
    // Usar el servicio general con configuración específica para resúmenes
    return await service.generateText({
      prompt: `${prompt}\n\n[PDF en base64: ${pdfBase64.substring(0, 100)}...]`,
      temperature: GENERATION_CONFIGS.summary.temperature,
      maxTokens: GENERATION_CONFIGS.summary.maxOutputTokens
    });
  }

  /**
   * Genera preguntas de opción múltiple basadas en un resumen
   */
  async generateQuestions(summary: string, numberOfQuestions = 10): Promise<string> {
    if (!summary) {
      throw new Error('El resumen es requerido');
    }

    const prompt = generateQuestionsPrompt(summary, numberOfQuestions);
    
    // Usar el servicio general con configuración específica para preguntas
    return await service.generateText({
      prompt,
      temperature: GENERATION_CONFIGS.questions.temperature,
      maxTokens: GENERATION_CONFIGS.questions.maxOutputTokens
    });
  }
}

export const pdfService = new PDFService();