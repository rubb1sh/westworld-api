import { Router } from 'express';

// Import the routes
{% for route in routes -%}
    import {{ route }} from './routes/{{ route }}';
{%- endfor %}

// Instantiate the main router
const router: Router = Router();

// Plug the routes
{% for route in routes -%}
    router.use({{ route }});
{%- endfor %}

export default router;
