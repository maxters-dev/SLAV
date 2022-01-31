import { generateFromRouteDictionaries } from './resources'
import posts from './resources/posts'
import categories from './resources/categories'
import products from './resources/products';
import contacts from './resources/contacts';
import employees from './resources/employees';
import tags from './resources/tags';
// import projects from './resources/projects'

const routes = generateFromRouteDictionaries([
    posts,
    contacts,
    categories,
    products,
    employees,
    tags
])

export default routes;
