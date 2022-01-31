import { dateTimeFormatter } from '@/schemas/helpers';
import { Model } from '@/types/laravel';
import { IndexRouteProps, ShowRouteProps } from '@/types/router';
import { createRouteResource } from '.';



export default createRouteResource({
    name: 'tags',
    formSchema: [],
    icon: 'mdi-mail',
    searchSchema: [
        { text: 'Nome da Tag', value: 'contains[subject]' },
    ]
})
