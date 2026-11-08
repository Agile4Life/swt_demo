package com.swp391.scms.ai.client;

public interface AiClient {

    String getProviderName();

    String getModelName();

    String generate(String systemPrompt, String userMessage);
}
