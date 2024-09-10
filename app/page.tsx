"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
  });
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Strength & Conditioning Coach AI
      </h1>
      <p className="mb-4 text-center">
        Ask me about workout programming, exercise techniques, nutrition, and
        more!
      </p>

      <div className="space-y-4 mb-4 overflow-y-auto max-h-[60vh]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <div className="font-bold">
              {m.role === "user" ? "You" : "Coach"}
            </div>
            <p>
              {m.content.length > 0 ? (
                m.content
              ) : (
                <span className="italic font-light">
                  {"calling tool: " + m?.toolInvocations?.[0].toolName}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask about workouts, nutrition, or training..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
