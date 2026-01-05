
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDesignSuggestions = async (productTitle: string, currentAddons: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is customizing a ${productTitle}. 
                Currently added: ${currentAddons.join(', ') || 'Nothing yet'}.
                Suggest 3 creative placement ideas or style themes (e.g. Vintage, Cyberpunk, Floral) that would look good. 
                Keep it short and inspiring.`,
    });
    return response.text || "Try adding some bold patches to the chest area!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Personalize your item with unique patches and embroidery!";
  }
};
