import { FieldViewSchema } from '../../types/schema';
import moment from 'moment';

const yesOrNot = (value: boolean) => (value ? 'Sim' : 'Não');

const dateFormatter = (date: string) => {
    return moment(date).format('DD/MM/YYYY');
};

const dateTimeFormatter = (date: string) => {
    return moment(date).format('DD/MM/YYYY HH:mm');
};

const addTimestampsFields = (fields: FieldViewSchema[]) => {
    fields.push(
        {
            name: 'created_at',
            title: 'Data de Criação',
            format: dateTimeFormatter
        },
        {
            name: 'updated_at',
            title: 'Data de Atualização',
            format: dateTimeFormatter
        }
    );

    return fields;
};

const genderOfWord = (word: string): 'm' | 'f' => {
    return word.split(' ')[0].endsWith('a') ? 'f' : 'm';
};

export { addTimestampsFields, dateFormatter, dateTimeFormatter, yesOrNot, genderOfWord };
