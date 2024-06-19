import aboutSchema from './path/to/your/schema'; 
import aboutSchema from '../models/aboutSchema.js';

const newAbout = {
    info: 1234,
    observacoes: 'Este é um exemplo de observação.'
};

try {
    const validatedData = aboutSchema.parse(newAbout);
    console.log('Dados validados:', validatedData);
    
} catch (e) {
    console.error('Erro de validação:', e.errors);
}