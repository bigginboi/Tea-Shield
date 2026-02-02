import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DISEASE_SYSTEM_PROMPT = `You are an expert tea leaf disease classifier. Analyze the provided tea leaf image and classify it into one of these categories:

DISEASES:
1. redRust - Red Rust: Reddish-brown pustules or spots, typically on lower leaf surface. Rusty, powdery appearance.
2. brownBlight - Brown Blight: Dark brown or black circular spots with concentric rings. Centers may have grayish appearance. Highly destructive.
3. blisterBlight - Blister Blight (White Spot): Pale white or cream-colored patches with blister-like raised areas on upper leaf surface.
4. grayBlight - Gray Blight: Silvery-gray patches spreading on leaves, often with dark margins.
5. anthracnose - Anthracnose: Brown-black sunken spots/lesions on leaves with defined margins.
6. birdsEyeSpot - Bird's Eye Spot: Small circular spots with light tan/cream centers and dark rings (eye-like appearance).
7. algalLeafSpot - Algal Leaf Spot: Grayish-green velvety patches, can turn orange-red crusty when mature.
8. healthy - Healthy Leaf: No visible disease symptoms, green healthy tissue.
9. uncertain - Uncertain: Cannot confidently identify the disease, poor image quality, or not a tea leaf.

RESPONSE FORMAT (JSON only, no markdown):
{
  "disease": "diseaseId",
  "confidence": 85,
  "severity": "low|medium|high",
  "severityPercentage": 15,
  "reasoning": "Brief explanation of visual indicators observed"
}

RULES:
- confidence: 0-100 based on how certain you are
- severity: "low" (<15% affected), "medium" (15-40%), "high" (>40%)
- severityPercentage: estimated percentage of leaf affected by disease
- If not a tea leaf or image is unclear, return "uncertain" with low confidence
- Be accurate - farmers depend on correct diagnosis`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_API_URL = Deno.env.get("AI_API_URL");
    if (!AI_API_KEY || !AI_API_URL) {
      console.error("AI_API_KEY or AI_API_URL is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure proper base64 format
    const imageUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    console.log("Sending image to AI for analysis...");

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: DISEASE_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this tea leaf image and classify the disease. Respond with JSON only.",
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        temperature: 0.1, // Low temperature for consistent classification
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", aiResponse);
      return new Response(
        JSON.stringify({ error: "No analysis result from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response content:", content);

    // Parse JSON response - handle potential markdown code blocks
    let analysis;
    try {
      // Remove markdown code blocks if present
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();
      
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate response structure
    const validDiseases = [
      "redRust", "brownBlight", "blisterBlight", "grayBlight",
      "anthracnose", "birdsEyeSpot", "algalLeafSpot", "healthy", "uncertain"
    ];

    if (!validDiseases.includes(analysis.disease)) {
      console.error("Invalid disease type:", analysis.disease);
      analysis.disease = "uncertain";
      analysis.confidence = 30;
    }

    console.log("Analysis complete:", analysis);

    return new Response(
      JSON.stringify({
        disease: analysis.disease,
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        severity: analysis.severity || "low",
        severityPercentage: Math.min(100, Math.max(0, analysis.severityPercentage || 0)),
        reasoning: analysis.reasoning || "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-leaf error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});