import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import {
  Science as ScienceIcon,
  Category as CategoryIcon,
  Schedule as DurationIcon,
  Person as AuthorIcon,
  CalendarToday as DateIcon,
  Assignment as StepIcon,
  Calculate as CalcIcon,
  Security as SafetyIcon,
  Build as EquipmentIcon,
  Inventory as MaterialIcon
} from '@mui/icons-material';
import { getCategoryColor, getDifficultyColor } from '../utils/helpers';

interface ProtocolPreviewProps {
  protocol: any;
}

const ProtocolPreview: React.FC<ProtocolPreviewProps> = ({ protocol }) => {
  const formatDate = (date: string) => {
    if (!date) return 'Nie podano';
    return new Date(date).toLocaleDateString('pl-PL');
  };

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {content}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          {protocol.title || 'Protokół badawczy'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
          {protocol.subtitle || 'Szczegółowy protokół badawczy'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {protocol.category && (
            <Chip
              label={protocol.category}
              sx={{
                backgroundColor: getCategoryColor(protocol.category),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
          {protocol.difficulty && (
            <Chip
              label={protocol.difficulty}
              sx={{
                backgroundColor: getDifficultyColor(protocol.difficulty),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
          {protocol.version && (
            <Chip
              label={`v${protocol.version}`}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
          )}
        </Box>
      </Paper>

      {/* Podstawowe informacje */}
      {renderSection(
        'Informacje podstawowe',
        <ScienceIcon color="primary" />,
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AuthorIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Autor:</Typography>
              <Typography variant="body2">{protocol.author || 'Nie podano'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DateIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Data utworzenia:</Typography>
              <Typography variant="body2">{formatDate(protocol.createdAt)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DurationIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Czas trwania:</Typography>
              <Typography variant="body2">{protocol.estimatedDuration || 'Nie podano'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Opis:</Typography>
            <Typography variant="body2" color="text.secondary">
              {protocol.description || 'Brak opisu protokołu'}
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Przegląd badania */}
      {renderSection(
        'Przegląd badania',
        <CategoryIcon color="primary" />,
        <Box>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Cel badania:</Typography>
          <Typography variant="body2" paragraph>
            {protocol.purpose || 'Nie określono celu badania'}
          </Typography>
          
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Zakres badania:</Typography>
          <Typography variant="body2" paragraph>
            {protocol.scope || 'Nie określono zakresu badania'}
          </Typography>
          
          {protocol.applicableStandards && protocol.applicableStandards.length > 0 && (
            <>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Normy stosowane:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {protocol.applicableStandards.map((standard: string, index: number) => (
                  <Chip key={index} label={standard} size="small" variant="outlined" />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Wyposażenie */}
      {protocol.equipment && protocol.equipment.length > 0 && renderSection(
        'Wyposażenie',
        <EquipmentIcon color="primary" />,
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Specyfikacja</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {protocol.equipment.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.model || '-'}</TableCell>
                  <TableCell>{item.specifications || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.required ? 'Wymagane' : 'Opcjonalne'}
                      size="small"
                      color={item.required ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Materiały */}
      {protocol.materials && protocol.materials.length > 0 && renderSection(
        'Materiały i odczynniki',
        <MaterialIcon color="primary" />,
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>Ilość</TableCell>
                <TableCell>Specyfikacja</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {protocol.materials.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>{item.specifications || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.required ? 'Wymagane' : 'Opcjonalne'}
                      size="small"
                      color={item.required ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Bezpieczeństwo */}
      {protocol.safetyGuidelines && protocol.safetyGuidelines.length > 0 && renderSection(
        'Zasady bezpieczeństwa',
        <SafetyIcon color="error" />,
        <List>
          {protocol.safetyGuidelines.map((guideline: any, index: number) => (
            <ListItem key={index}>
              <ListItemIcon>
                <SafetyIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={guideline.guideline}
                secondary={guideline.description}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Kroki procedury */}
      {protocol.steps && protocol.steps.length > 0 && renderSection(
        'Procedura badawcza',
        <StepIcon color="primary" />,
        <Box>
          {protocol.steps.map((step: any, index: number) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label={`Krok ${index + 1}`} color="primary" size="small" />
                <Typography variant="subtitle2" fontWeight="bold">
                  {step.title}
                </Typography>
                {step.duration && (
                  <Chip label={step.duration} size="small" variant="outlined" />
                )}
              </Box>
              
              <Typography variant="body2" paragraph>
                {step.description}
              </Typography>
              
              {step.instructions && step.instructions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    Instrukcje:
                  </Typography>
                  <List dense>
                    {step.instructions.map((instruction: string, instrIndex: number) => (
                      <ListItem key={instrIndex} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip label={instrIndex + 1} size="small" color="primary" sx={{ minWidth: 24 }} />
                              <Typography variant="body2">{instruction}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {step.safety && step.safety.length > 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                    Środki bezpieczeństwa:
                  </Typography>
                  <List dense>
                    {step.safety.map((safety: string, safetyIndex: number) => (
                      <ListItem key={safetyIndex} sx={{ py: 0 }}>
                        <ListItemText primary={safety} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Obliczenia */}
      {protocol.calculations && protocol.calculations.length > 0 && renderSection(
        'Obliczenia i wzory',
        <CalcIcon color="primary" />,
        <Box>
          {protocol.calculations.map((calc: any, index: number) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                {calc.name}
              </Typography>
              <Typography variant="body2" paragraph>
                {calc.description}
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', color: 'primary.main', textAlign: 'center' }}>
                  {calc.formula}
                </Typography>
              </Box>
              {calc.variables && calc.variables.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Jednostka</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calc.variables.map((variable: any, varIndex: number) => (
                        <TableRow key={varIndex}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {variable.symbol}
                          </TableCell>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{variable.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Bibliografia */}
      {protocol.references && protocol.references.length > 0 && renderSection(
        'Bibliografia',
        <CategoryIcon color="primary" />,
        <List>
          {protocol.references.map((reference: any, index: number) => (
            <ListItem key={index} divider={index < protocol.references.length - 1}>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2" fontWeight="bold" component="span">
                      [{index + 1}] {reference.title}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {reference.authors} ({reference.year})
                    </Typography>
                    {reference.source && (
                      <Typography variant="caption" color="text.secondary">
                        {reference.source}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Stopka */}
      <Paper sx={{ p: 2, mt: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
        <Typography variant="caption" color="text.secondary">
          Protokół wygenerowany przez Edith Research Platform
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Data wygenerowania: {new Date().toLocaleDateString('pl-PL')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProtocolPreview;
