/**
 * CTF (Capture The Flag) Scenario Schema
 * 
 * @author Ying Wang
 * @date 2026-02-12
 * @version 1.0
 */

import { BaseScenario, LLMConfig } from './base-scenario.schema';

export interface CTFScenario extends BaseScenario {
  scenario_type: "ctf";
  
  game_content: CTFGameContent;
  
  // LLM configuration used for generation
  llm_config?: LLMConfig;
  
  // Custom instructions provided by instructor
  custom_instructions?: string;
  
  // Gamification settings (optional, may be set by Raagini)
  gamification_config?: GamificationConfig;
}

export interface CTFGameContent {
  // Display Content
  description: string; // 300-600 chars - shown to learners
  background_story?: string; // 100-300 chars - optional narrative context
  
  // CTF Core Mechanics
  flag: string; // The flag to capture
  flag_format: string; // e.g., "CTF{...}"
  flag_validation: FlagValidationType;
  flag_regex?: string; // Required if validation is "regex"
  
  // Scoring
  max_score: number; // Default: 100
  
  // Environment Configuration
  environment?: CTFEnvironment;
  
  // Progressive Hints (3-7 hints)
  hints: CTFHint[];
  
  // Feedback Templates
  feedback_templates: CTFFeedbackTemplates;
  
  // Solutions (at least 1)
  solutions: CTFSolution[];
  
  // Educational Content (optional but recommended)
  educational_content?: EducationalContent;
}

export type FlagValidationType = "exact_match" | "regex" | "case_insensitive"; // Validation method for submitted flags

/**
 * Environment Types for CTF scenarios
 * Flexible structure to accommodate various types of environments
 */
export type EnvironmentType = 
  | "web_application" 
  | "pcap_file" 
  | "ssh_access" 
  | "virtual_network"
  | "docker_container"
  | "cloud_environment"
  | "other";

  // Note: For "other" type, instructors can provide a custom description of the environment.
export interface CTFEnvironment {
  type: EnvironmentType;
  description?: string; // Human-readable description
  
  // Required Tools (e.g., ["Wireshark", "Burp Suite"])
  required_tools?: string[];
  
  // Flexible access information
  access_info?: Record<string, any>;
  
  // Common fields (shortcuts for convenience)
  url?: string; // Direct URL if type is web_application
  credentials?: {
    username: string;
    password: string;
  };
  
  // Files (e.g., PCAP files, config files)
  files?: CTFFile[];
  
  // Technical stack information
  tech_stack?: string[]; // e.g., ["PHP 7.4", "MySQL 5.7", "Apache 2.4"]
}

export interface CTFFile {
  name: string; 
  url: string; // Direct download link or path to the file
  size?: string; // e.g., "2.5 MB"
  description?: string; // What is this file and how is it relevant?
  checksum?: string; // MD5 or SHA256
}

export type HintLevel = "minimal" | "guided" | "detailed";

export interface CTFHint {
  id: number; // Sequential: 1, 2, 3, ...
  level: HintLevel;
  content: string; // The actual hint text
  
  // Suggested cost for gamification (points to deduct)
  suggested_cost: number;
  
  // Optional unlock condition (e.g., "after 5 minutes", "after 2 attempts")
  unlock_condition?: string;
}

export interface CTFFeedbackTemplates {
  correct: string; // Feedback when flag is correct
  invalid_format: string; // Feedback when flag format is wrong
  close?: string; // Feedback when answer is close but not quite right
  wrong_approach?: string; // Feedback when using wrong method
  time_warning?: string; // Warning when time is running out
  
  // Custom feedback for specific errors (extensible)
  [key: string]: string | undefined;
}

export type SolutionDifficulty = "easy" | "medium" | "hard";

export interface CTFSolution {
  method: string; // e.g., "Union-based SQL Injection"
  difficulty: SolutionDifficulty;
  steps: string[]; // Step-by-step instructions
  payload?: string; // Actual command/code to execute
  explanation: string; // Why this solution works
  prerequisites?: string[]; // Required knowledge
}

export interface EducationalContent {
  what_is: string; // What is this vulnerability/technique?
  how_it_works: string; // How does it work?
  real_world_examples?: string[]; // Famous incidents or cases
  prevention: string; // How to prevent/mitigate
  related_topics?: string[]; // Related areas to explore
  references?: string[]; // Links to external resources
}

export interface GamificationConfig {
  show_leaderboard: boolean; // Default: true
  allow_retries: boolean; // Default: true
  retry_penalty: number; // Points deducted per retry (default: 5)
  time_bonus_enabled: boolean; // Award bonus for fast completion
  collaboration_mode: "individual" | "team"; // Default: individual
}

/**
 * Validation constraints for CTF scenarios
 */
export const CTF_CONSTRAINTS = {
  description: {
    min_length: 300,
    max_length: 600
  },
  background_story: {
    min_length: 100,
    max_length: 300
  },
  hints: {
    min_count: 3,
    max_count: 7
  },
  solutions: {
    min_count: 1
  },
  flag: {
    pattern: /^CTF\{[^\}]+\}$/,
    min_length: 10,
    max_length: 100
  }
} as const;

/**
 * Type guard to check if a scenario is a CTF scenario
 */
export function isCTFScenario(scenario: any): scenario is CTFScenario {
  return scenario && scenario.scenario_type === "ctf";
}

/**
 * Validate CTF scenario against constraints
 */
export function validateCTFScenario(scenario: CTFScenario): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validate description length
  const descLen = scenario.game_content.description.length;
  if (descLen < CTF_CONSTRAINTS.description.min_length || 
      descLen > CTF_CONSTRAINTS.description.max_length) {
    errors.push(`Description must be ${CTF_CONSTRAINTS.description.min_length}-${CTF_CONSTRAINTS.description.max_length} characters`);
  }
  
  // Validate flag format
  if (!CTF_CONSTRAINTS.flag.pattern.test(scenario.game_content.flag)) {
    errors.push('Flag must match format CTF{...}');
  }
  
  // Validate hints count
  const hintCount = scenario.game_content.hints.length;
  if (hintCount < CTF_CONSTRAINTS.hints.min_count || 
      hintCount > CTF_CONSTRAINTS.hints.max_count) {
    errors.push(`Must have ${CTF_CONSTRAINTS.hints.min_count}-${CTF_CONSTRAINTS.hints.max_count} hints`);
  }
  
  // Validate solutions count
  if (scenario.game_content.solutions.length < CTF_CONSTRAINTS.solutions.min_count) {
    errors.push(`Must have at least ${CTF_CONSTRAINTS.solutions.min_count} solution`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}