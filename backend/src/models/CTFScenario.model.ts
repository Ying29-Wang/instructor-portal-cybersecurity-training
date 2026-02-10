/**
 * CTF Scenario Mongoose Model
 * MongoDB schema definition for CTF scenarios
 * 
 * @author Ying Wang
 * @date 2026-02-12
 * @version 1.0
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { CTFScenario } from '../schemas/scenarios';

/**
 * Mongoose Document interface
 * Extends CTFScenario with Mongoose Document methods
 */
export interface CTFScenarioDocument extends Omit<CTFScenario, 'scenario_id'>, Document {
  scenario_id: string;
}

/**
 * Hint Sub-schema
 */
const HintSchema = new Schema({
  id: { 
    type: Number, 
    required: true 
  },
  level: { 
    type: String, 
    enum: ['minimal', 'guided', 'detailed'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  suggested_cost: { 
    type: Number, 
    required: true,
    min: 0
  },
  unlock_condition: { 
    type: String,
    trim: true
  }
}, { _id: false });

/**
 * Solution Sub-schema
 */
const SolutionSchema = new Schema({
  method: { 
    type: String, 
    required: true,
    trim: true
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  steps: [{ 
    type: String,
    required: true
  }],
  payload: { 
    type: String,
    trim: true
  },
  explanation: { 
    type: String, 
    required: true,
    trim: true
  },
  prerequisites: [{ 
    type: String 
  }]
}, { _id: false });

/**
 * File Sub-schema (for environment files)
 */
const FileSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  size: { 
    type: String 
  },
  description: { 
    type: String 
  },
  checksum: { 
    type: String 
  }
}, { _id: false });

/**
 * Environment Sub-schema
 */
const EnvironmentSchema = new Schema({
  type: {
    type: String,
    enum: [
      'web_application',
      'pcap_file',
      'ssh_access',
      'virtual_network',
      'docker_container',
      'cloud_environment',
      'other'
    ],
    required: true
  },
  description: { 
    type: String,
    trim: true
  },
  required_tools: [{ 
    type: String 
  }],
  access_info: { 
    type: Schema.Types.Mixed // Flexible structure
  },
  url: { 
    type: String,
    trim: true
  },
  credentials: {
    username: { type: String },
    password: { type: String }
  },
  files: [FileSchema],
  tech_stack: [{ 
    type: String 
  }]
}, { _id: false });

/**
 * Educational Content Sub-schema
 */
const EducationalContentSchema = new Schema({
  what_is: { 
    type: String, 
    required: true,
    trim: true
  },
  how_it_works: { 
    type: String, 
    required: true,
    trim: true
  },
  real_world_examples: [{ 
    type: String 
  }],
  prevention: { 
    type: String, 
    required: true,
    trim: true
  },
  related_topics: [{ 
    type: String 
  }],
  references: [{ 
    type: String 
  }]
}, { _id: false });

/**
 * Feedback Templates Sub-schema
 */
const FeedbackTemplatesSchema = new Schema({
  correct: { 
    type: String, 
    required: true,
    trim: true
  },
  invalid_format: { 
    type: String, 
    required: true,
    trim: true
  },
  close: { 
    type: String,
    trim: true
  },
  wrong_approach: { 
    type: String,
    trim: true
  },
  time_warning: { 
    type: String,
    trim: true
  }
}, { 
  _id: false,
  strict: false // Allow additional custom feedback fields
});

/**
 * Game Content Sub-schema
 */
const GameContentSchema = new Schema({
  description: { 
    type: String, 
    required: true,
    minlength: 300,
    maxlength: 600,
    trim: true
  },
  background_story: { 
    type: String,
    minlength: 100,
    maxlength: 300,
    trim: true
  },
  flag: { 
    type: String, 
    required: true,
    match: /^CTF\{[^\}]+\}$/,
    trim: true
  },
  flag_format: { 
    type: String, 
    default: 'CTF{...}',
    trim: true
  },
  flag_validation: { 
    type: String, 
    enum: ['exact_match', 'regex', 'case_insensitive'],
    default: 'exact_match'
  },
  flag_regex: { 
    type: String,
    trim: true
  },
  max_score: { 
    type: Number, 
    default: 100,
    min: 0
  },
  environment: EnvironmentSchema,
  hints: {
    type: [HintSchema],
    required: true,
    validate: {
      validator: function(hints: any[]) {
        return hints.length >= 3 && hints.length <= 7;
      },
      message: 'Must have between 3 and 7 hints'
    }
  },
  feedback_templates: { 
    type: FeedbackTemplatesSchema, 
    required: true 
  },
  solutions: {
    type: [SolutionSchema],
    required: true,
    validate: {
      validator: function(solutions: any[]) {
        return solutions.length >= 1;
      },
      message: 'Must have at least 1 solution'
    }
  },
  educational_content: EducationalContentSchema
}, { _id: false });

/**
 * Basic Info Sub-schema
 */
const BasicInfoSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    minlength: 1,
    maxlength: 200,
    trim: true
  },
  topic: { 
    type: String, 
    required: true,
    trim: true,
    index: true // Index for faster queries
  },
  subtopic: { 
    type: String,
    trim: true
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
    index: true // Index for filtering
  },
  estimated_time: { 
    type: Number, 
    required: true,
    min: 1
  },
  learning_objectives: {
    type: [{ type: String }],
    required: true,
    validate: {
      validator: function(objectives: string[]) {
        return objectives.length >= 1;
      },
      message: 'Must have at least 1 learning objective'
    }
  },
  tags: [{ 
    type: String,
    trim: true
  }]
}, { _id: false });

/**
 * LLM Config Sub-schema
 */
const LLMConfigSchema = new Schema({
  preset: {
    type: String,
    enum: ['beginner-friendly', 'balanced', 'challenge', 'custom']
  },
  creativity: {
    type: Number,
    min: 0,
    max: 1
  },
  hint_detail_level: {
    type: Number,
    min: 0,
    max: 1
  },
  feedback_detail_level: {
    type: Number,
    min: 0,
    max: 1
  },
  explanation_depth: {
    type: Number,
    min: 0,
    max: 1
  },
  hint_count: {
    type: Number,
    min: 3,
    max: 7
  },
  narrative_style: {
    type: String,
    enum: ['realistic', 'gamified', 'academic']
  },
  communication_style: {
    type: String,
    enum: ['professional', 'friendly', 'mentor', 'peer']
  }
}, { _id: false });

/**
 * Gamification Config Sub-schema
 */
const GamificationConfigSchema = new Schema({
  show_leaderboard: { 
    type: Boolean, 
    default: true 
  },
  allow_retries: { 
    type: Boolean, 
    default: true 
  },
  retry_penalty: { 
    type: Number, 
    default: 5,
    min: 0
  },
  time_bonus_enabled: { 
    type: Boolean, 
    default: false 
  },
  collaboration_mode: {
    type: String,
    enum: ['individual', 'team'],
    default: 'individual'
  }
}, { _id: false });

/**
 * Metadata Sub-schema
 */
const MetadataSchema = new Schema({
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  created_by: { 
    type: String, 
    required: true,
    index: true // Index for querying instructor's scenarios
  },
  version: { 
    type: Number, 
    default: 1,
    min: 1
  },
  status: { 
    type: String, 
    enum: ['draft', 'pending_review', 'published', 'archived'],
    default: 'draft',
    index: true // Index for filtering by status
  },
  llm_generated: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

/**
 * Main CTF Scenario Schema
 */
const CTFScenarioSchema = new Schema({
  scenario_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  scenario_type: { 
    type: String, 
    enum: ['ctf'], 
    default: 'ctf',
    immutable: true // Cannot be changed after creation
  },
  
  basic_info: { 
    type: BasicInfoSchema, 
    required: true 
  },
  
  game_content: { 
    type: GameContentSchema, 
    required: true 
  },
  
  llm_config: LLMConfigSchema,
  
  custom_instructions: { 
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  gamification_config: GamificationConfigSchema,
  
  metadata: { 
    type: MetadataSchema, 
    required: true 
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  collection: 'ctf_scenarios' // Collection name in MongoDB
});

/**
 * Indexes for better query performance
 */
CTFScenarioSchema.index({ 'basic_info.topic': 1 });
CTFScenarioSchema.index({ 'basic_info.difficulty': 1 });
CTFScenarioSchema.index({ 'metadata.status': 1 });
CTFScenarioSchema.index({ 'metadata.created_by': 1 });
CTFScenarioSchema.index({ 'metadata.created_at': -1 }); // Sort by newest

/**
 * Pre-save middleware
 * Updates the updated_at timestamp and version
 */
CTFScenarioSchema.pre('save', function(next) {
  this.metadata.updated_at = new Date();
  
  // Increment version if not a new document
  if (!this.isNew) {
    this.metadata.version += 1;
  }
  
  next();
});

/**
 * Instance Methods
 */

// Publish scenario
CTFScenarioSchema.methods.publish = function() {
  this.metadata.status = 'published';
  return this.save();
};

// Archive scenario
CTFScenarioSchema.methods.archive = function() {
  this.metadata.status = 'archived';
  return this.save();
};

// Save as draft
CTFScenarioSchema.methods.saveDraft = function() {
  this.metadata.status = 'draft';
  return this.save();
};

/**
 * Static Methods
 */

// Find published scenarios
CTFScenarioSchema.statics.findPublished = function() {
  return this.find({ 'metadata.status': 'published' });
};

// Find scenarios by instructor
CTFScenarioSchema.statics.findByInstructor = function(instructorId: string) {
  return this.find({ 'metadata.created_by': instructorId });
};

// Find scenarios by topic
CTFScenarioSchema.statics.findByTopic = function(topic: string) {
  return this.find({ 'basic_info.topic': topic });
};

// Find scenarios by status
CTFScenarioSchema.statics.findByStatus = function(status: string) {
  return this.find({ 'metadata.status': status });
};

/**
 * Virtual properties
 */

// Get full title with difficulty
CTFScenarioSchema.virtual('fullTitle').get(function() {
  return `${this.basic_info.title} (${this.basic_info.difficulty})`;
});

// Check if scenario is editable
CTFScenarioSchema.virtual('isEditable').get(function() {
  return ['draft', 'pending_review'].includes(this.metadata.status);
});

// Check if scenario is published
CTFScenarioSchema.virtual('isPublished').get(function() {
  return this.metadata.status === 'published';
});

/**
 * Configure toJSON to include virtuals
 */
CTFScenarioSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Remove MongoDB _id, keep scenario_id
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

/**
 * Model interface with static methods
 */
interface CTFScenarioModel extends Model<CTFScenarioDocument> {
  findPublished(): Promise<CTFScenarioDocument[]>;
  findByInstructor(instructorId: string): Promise<CTFScenarioDocument[]>;
  findByTopic(topic: string): Promise<CTFScenarioDocument[]>;
  findByStatus(status: string): Promise<CTFScenarioDocument[]>;
}

/**
 * Create and export the model
 */
export const CTFScenarioModel = mongoose.model<CTFScenarioDocument, CTFScenarioModel>(
  'CTFScenario',
  CTFScenarioSchema
);

/**
 * Helper function to create a new CTF scenario
 */
export async function createCTFScenario(
  scenarioData: Partial<CTFScenario>,
  instructorId: string
): Promise<CTFScenarioDocument> {
  const scenario = new CTFScenarioModel({
    scenario_id: new mongoose.Types.ObjectId().toString(),
    scenario_type: 'ctf',
    ...scenarioData,
    metadata: {
      created_by: instructorId,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
      status: 'draft',
      llm_generated: scenarioData.llm_config ? true : false
    }
  });
  
  return await scenario.save();
}

/**
 * Helper function to validate CTF scenario data
 */
export function validateCTFScenarioData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate description length
  if (data.game_content?.description) {
    const descLen = data.game_content.description.length;
    if (descLen < 300 || descLen > 600) {
      errors.push(`Description must be 300-600 characters (current: ${descLen})`);
    }
  }
  
  // Validate flag format
  if (data.game_content?.flag) {
    if (!/^CTF\{[^\}]+\}$/.test(data.game_content.flag)) {
      errors.push('Flag must match format CTF{...}');
    }
  }
  
  // Validate hints count
  if (data.game_content?.hints) {
    const hintCount = data.game_content.hints.length;
    if (hintCount < 3 || hintCount > 7) {
      errors.push(`Must have 3-7 hints (current: ${hintCount})`);
    }
  }
  
  // Validate solutions count
  if (data.game_content?.solutions) {
    if (data.game_content.solutions.length < 1) {
      errors.push('Must have at least 1 solution');
    }
  }
  
  // Validate learning objectives
  if (data.basic_info?.learning_objectives) {
    if (data.basic_info.learning_objectives.length < 1) {
      errors.push('Must have at least 1 learning objective');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Export types for use in other files
 */
export type { CTFScenarioDocument };