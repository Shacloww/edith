import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Checkbox,
  FormGroup,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Select,
  MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Question, QuestionType, Study } from '../types';

const TakeSurvey: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  
  const [study, setStudy] = useState<Study | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studyId) {
      fetchStudy(studyId);
    }
  }, [studyId]);

  const fetchStudy = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/studies/${id}`);
      
      if (response.data.success) {
        const studyData = response.data.data;
        setStudy(studyData);
        
        // Questions are already deserialized by backend
        if (studyData.researchSchema?.questions) {
          setQuestions(studyData.researchSchema.questions);
        }
      } else {
        setError('Nie udało się pobrać badania');
      }
    } catch (error) {
      console.error('Error fetching study:', error);
      setError('Wystąpił błąd podczas pobierania badania');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    console.log('🔥 Answer changing:', { questionId, value, currentAnswers: answers });
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const validateAnswers = () => {
    const errors: string[] = [];
    
    questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || answer.toString().trim() === '') {
          errors.push(`Pole "${question.title}" jest wymagane`);
        }
      }
    });
    
    return errors;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Walidacja lokalna przed wysłaniem
      const validationErrors = validateAnswers();
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        setSubmitting(false);
        return;
      }
      
      console.log('Submitting data:', { studyId, answers });
      
      const response = await api.post('/responses', {
        studyId,
        answers
      });

      if (response.data.success) {
        toast.success('Odpowiedzi zostały zapisane!');
        navigate('/');
      } else {
        toast.error('Nie udało się zapisać odpowiedzi');
      }
    } catch (error: any) {
      console.error('Error submitting answers:', error);
      console.error('Error response:', error.response?.data);
      
      // Obsługa błędów z backendu
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => toast.error(err));
      } else {
        toast.error('Wystąpił błąd podczas zapisywania odpowiedzi');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];
    const isRequired = question.required;
    const questionTitle = `${question.title}${isRequired ? ' *' : ''}`;
    
    // Debug - sprawdźmy co otrzymujemy
    console.log('Question type:', question.type, 'Question:', question);

    const questionType = String(question.type).toLowerCase();
    
    switch (questionType) {
      case 'single_choice':
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <RadioGroup
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options?.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : (option as any).value;
                const optionLabel = typeof option === 'string' ? option : (option as any).label;
                
                return (
                  <FormControlLabel
                    key={index}
                    value={optionValue}
                    control={<Radio />}
                    label={optionLabel}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        );

      case 'multiple_choice':
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <FormGroup>
              {question.options?.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : (option as any).value;
                const optionLabel = typeof option === 'string' ? option : (option as any).label;
                
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={Array.isArray(currentAnswer) && currentAnswer.includes(optionValue)}
                        onChange={(e) => {
                          const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
                          if (e.target.checked) {
                            handleAnswerChange(question.id, [...currentValues, optionValue]);
                          } else {
                            handleAnswerChange(question.id, currentValues.filter(v => v !== optionValue));
                          }
                        }}
                      />
                    }
                    label={optionLabel}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
        );

      case 'text':
        return (
          <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <TextField
              multiline
              rows={4}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Wpisz swoją odpowiedź..."
              sx={{ mt: 1 }}
              required={isRequired}
              error={isRequired && (!currentAnswer || currentAnswer.toString().trim() === '')}
            />
          </FormControl>
        );

      case 'number':
        return (
          <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <TextField
              type="number"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Wpisz liczbę..."
              inputProps={{
                min: question.validation?.min,
                max: question.validation?.max
              }}
              sx={{ mt: 1 }}
              required={isRequired}
              error={isRequired && (!currentAnswer || currentAnswer.toString().trim() === '')}
            />
          </FormControl>
        );

      case 'scale':
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <RadioGroup
              row
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
              sx={{ justifyContent: 'center', mt: 2 }}
            >
              {Array.from({ length: (question.validation?.max || 5) - (question.validation?.min || 1) + 1 }, (_, i) => {
                const value = (question.validation?.min || 1) + i;
                return (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={value.toString()}
                    labelPlacement="top"
                  />
                );
              })}
            </RadioGroup>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption">{question.validation?.minLabel || 'Min'}</Typography>
              <Typography variant="caption">{question.validation?.maxLabel || 'Max'}</Typography>
            </Box>
          </FormControl>
        );

      case 'date':
        return (
          <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <TextField
              type="date"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              sx={{ mt: 1 }}
              required={isRequired}
              error={isRequired && (!currentAnswer || currentAnswer.toString().trim() === '')}
            />
          </FormControl>
        );

      case 'textarea':
        return (
          <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <TextField
              multiline
              rows={6}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Wpisz swoją odpowiedź..."
              sx={{ mt: 1 }}
              required={isRequired}
              error={isRequired && (!currentAnswer || currentAnswer.toString().trim() === '')}
            />
          </FormControl>
        );

      case 'select':
        return (
          <FormControl fullWidth>
            <FormLabel sx={{ color: isRequired ? 'error.main' : 'text.primary' }}>
              {questionTitle}
            </FormLabel>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {question.description}
              </Typography>
            )}
            <Select
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              displayEmpty
              sx={{ mt: 1 }}
              required={isRequired}
              error={isRequired && (!currentAnswer || currentAnswer.toString().trim() === '')}
            >
              <MenuItem value="">
                <em>Wybierz opcję...</em>
              </MenuItem>
              {question.options?.map((option, index) => {
                // Support both string and object formats
                const optionValue = typeof option === 'string' ? option : (option as any).value;
                const optionLabel = typeof option === 'string' ? option : (option as any).label;
                
                return (
                  <MenuItem key={index} value={optionValue}>
                    {optionLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );

      default:
        return <Typography>Nieobsługiwany typ pytania: {question.type}</Typography>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!study || questions.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">Badanie nie zostało znalezione lub nie ma pytań.</Alert>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const requiredQuestions = questions.filter(q => q.required).length;
  const answeredRequired = questions.filter(q => q.required && answers[q.id] && answers[q.id].toString().trim() !== '').length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {study.title}
      </Typography>
      
      {study.description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {study.description}
        </Typography>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">
            Pytanie {currentQuestionIndex + 1} z {questions.length}
          </Typography>
          <Typography variant="caption" color="error.main">
            * pola wymagane
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Wypełniono wymaganych: {answeredRequired} / {requiredQuestions}
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Stepper activeStep={currentQuestionIndex} sx={{ mb: 4 }}>
        {questions.map((_, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          variant="outlined"
        >
          Wstecz
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
            color="primary"
          >
            {submitting ? 'Zapisywanie...' : 'Wyślij odpowiedzi'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
          >
            Dalej
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TakeSurvey;
