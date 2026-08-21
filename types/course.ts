export interface GeneratorDefinition {
  id: string;

  config?: Record<string, unknown>;
}

export interface TopicDefinition {
  id: string;

  name: string;

  generators: GeneratorDefinition[];
}

export interface Course {
  id: string;

  name: string;

  description?: string;

  topics: TopicDefinition[];
}
