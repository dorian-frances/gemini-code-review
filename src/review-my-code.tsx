import { Detail, showToast, Toast } from "@raycast/api";
import { AsyncState, useFetch } from "@raycast/utils";
import { GEMINI_API_KEY } from "./adapter/gemini-adapter";
import { GenerateContentResponse } from "@google/generative-ai";

export default function Command() {
  const prompt = "Tell me something interesting about the history of AI";
  const { isLoading, data, error }: AsyncState<string> = useFetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{text: prompt}]
      }]
    }),
    mapResult: (data: GenerateContentResponse)=> {
      if (data !== undefined) {
        const candidateResponse = data.candidates?.at(0);
        if (candidateResponse !== undefined) {
          return { data: candidateResponse.content.parts[0].text ?? "Aucune réponse obtenue." }
        }
      }

      return {
        data: "Aucune réponse obtenue."
      }
    }
  })

  if (error) {
    showToast({ style: Toast.Style.Failure, title: "Erreur", message: error.message });
    return <Detail markdown="### ❌ Une erreur est survenue lors de la récupération des données." />;
  }

  return <Detail isLoading={isLoading} markdown={data} />;
}
