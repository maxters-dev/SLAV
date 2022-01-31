import { FieldConfig } from '@/types/schema'
import moment from 'moment'

const yesOrNot = (value: Boolean) => (value ? 'Sim' : 'Não')

const dateFormatter = (date: string) => {
  return moment(date).format('DD/MM/YYYY')
}

const dateTimeFormatter = (date: string) => {
  return moment(date).format('DD/MM/YYYY HH:mm')
}

const addTimestampsFields = (fields: FieldConfig[]) => {
  fields.push(
    { name: 'created_at', title: 'Data de Criação', format: dateTimeFormatter },
    { name: 'updated_at', title: 'Data de Atualização', format: dateTimeFormatter }
  )

  return fields
}

export {
  addTimestampsFields,
  dateFormatter,
  dateTimeFormatter,
  yesOrNot
}
