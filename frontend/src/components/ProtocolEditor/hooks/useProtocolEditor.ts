import { useState, useCallback, useEffect } from 'react';
import { ResearchProtocol, ProtocolFormData } from '../types/protocol';
import { validateProtocol } from '../utils/validation';
import { generateProtocolId } from '../utils/helpers';

interface UseProtocolEditorReturn {
  protocol: ProtocolFormData;
  setProtocol: (protocol: ProtocolFormData) => void;
  updateProtocol: (updates: Partial<ProtocolFormData>) => void;
  resetProtocol: () => void;
  saveProtocol: () => Promise<boolean>;
  loadProtocol: (id: string) => Promise<boolean>;
  isLoading: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  isValid: boolean;
}

const createEmptyProtocol = (): ProtocolFormData => ({
  id: '',
  title: '',
  description: '',
  category: 'physical',
  estimatedDuration: '',
  difficulty: 'basic',
  overview: {
    purpose: '',
    scope: '',
    principles: '',
    standards: []
  },
  equipment: [],
  materials: [],
  safetyGuidelines: [],
  testConditions: [],
  steps: [],
  calculations: [],
  acceptanceCriteria: [],
  commonIssues: [],
  typicalValues: [],
  references: [],
  isDirty: false,
  isValid: true, // Inicjalnie ważny, żeby nie pokazywać błędów na starcie
  errors: {} // Brak błędów na starcie
});

export const useProtocolEditor = (initialProtocol?: ResearchProtocol): UseProtocolEditorReturn => {
  const [protocol, setProtocolState] = useState<ProtocolFormData>(() => 
    initialProtocol || createEmptyProtocol()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Usunięto automatyczną walidację - będzie tylko przy zapisie

  const setProtocol = useCallback((newProtocol: ProtocolFormData) => {
    setProtocolState({
      ...newProtocol,
      isDirty: true
    });
  }, []);

  const updateProtocol = useCallback((updates: Partial<ProtocolFormData>) => {
    setProtocolState(prev => ({
      ...prev,
      ...updates,
      isDirty: true
    }));
  }, []);

  const resetProtocol = useCallback(() => {
    setProtocolState(createEmptyProtocol());
  }, []);

  const saveProtocol = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Waliduj protokół przed zapisem
      const { isValid, errors } = validateProtocol(protocol);
      
      // Zaktualizuj stan z błędami walidacji
      setProtocolState(prev => ({
        ...prev,
        isValid,
        errors
      }));

      // Jeśli nie jest ważny, nie zapisuj
      if (!isValid) {
        return false;
      }

      // Generuj ID jeśli nie ma
      const protocolToSave = {
        ...protocol,
        id: protocol.id || generateProtocolId(protocol.title || 'untitled')
      };

      // Tutaj będzie API call do zapisu protokołu
      // const response = await api.saveProtocol(protocolToSave);
      
      // Symulacja zapisu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProtocolState(prev => ({
        ...prev,
        ...protocolToSave,
        isDirty: false,
        isValid: true,
        errors: {}
      }));

      return true;
    } catch (error) {
      console.error('Błąd podczas zapisywania protokołu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [protocol]);

  const loadProtocol = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Tutaj będzie API call do wczytania protokołu
      // const response = await api.getProtocol(id);
      
      // Symulacja wczytania
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // setProtocolState({
      //   ...response.data,
      //   isDirty: false
      // });

      return true;
    } catch (error) {
      console.error('Błąd podczas wczytywania protokołu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    protocol,
    setProtocol,
    updateProtocol,
    resetProtocol,
    saveProtocol,
    loadProtocol,
    isLoading,
    isDirty: protocol.isDirty || false,
    errors: protocol.errors || {},
    isValid: protocol.isValid || false
  };
};
