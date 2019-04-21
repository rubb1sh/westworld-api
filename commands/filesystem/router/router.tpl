import { Router } from 'express'

// Import the controllers
{% for controller in controllers -%}
    import {{ controller }} from './controllers/{{ controller }}'
{%- endfor %}

// Instantiate the main router
const router: Router = Router()

// Plug the controllers
{% for controller in controllers -%}
    router.use({{ controller }})
{%- endfor %}

export default router
