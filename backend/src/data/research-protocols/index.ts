/**
 * Research Protocols Index
 * Centralny punkt dostępu do wszystkich protokołów badawczych
 */

import { ISO1133Protocol } from './iso-1133-melt-flow-rate';
import { ISO289Protocol } from './iso-289-mooney-viscosity';
import { ASTMD412Protocol } from './astm-d412-tensile-strength';

export interface ResearchProtocol {
  id: string;
  title: string;
  version: string;
  category: string;
  description: string;
  equipment: {
    required: string[];
    optional: string[];
  };
  testConditions: any;
  steps: ProtocolStep[];
  calculations: any;
  acceptance_criteria: any;
  common_issues?: CommonIssue[];
  typical_values?: TypicalValue[];
  maintenance?: any;
}

export interface ProtocolStep {
  id: string;
  title: string;
  duration: string;
  instructions: string[];
  safety: string[];
  tips: string[];
}

export interface CommonIssue {
  problem: string;
  causes: string[];
  solutions: string[];
}

export interface TypicalValue {
  material: string;
  range?: string;
  tensile_strength?: string;
  elongation?: string;
  comment?: string;
}

// Eksport wszystkich protokołów
export const ResearchProtocols: Record<string, ResearchProtocol> = {
  'iso-1133-mfr': ISO1133Protocol,
  'iso-289-mooney': ISO289Protocol,
  'astm-d412-tensile': ASTMD412Protocol,
};

// Funkcje pomocnicze
export const getProtocolById = (id: string): ResearchProtocol | undefined => {
  return ResearchProtocols[id];
};

export const getProtocolsByCategory = (category: string): ResearchProtocol[] => {
  return Object.values(ResearchProtocols).filter(protocol => protocol.category === category);
};

export const getAllProtocols = (): ResearchProtocol[] => {
  return Object.values(ResearchProtocols);
};

export const getProtocolCategories = (): string[] => {
  const categories = new Set(Object.values(ResearchProtocols).map(p => p.category));
  return Array.from(categories);
};

// Eksport domyślny
export default ResearchProtocols;
