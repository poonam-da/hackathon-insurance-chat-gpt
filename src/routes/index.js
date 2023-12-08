import { ChatRouter } from './Chat'

const Routes = [
    { path: '/chat', router: ChatRouter }
]

Routes.init = (app) => {
    try {
        Routes.forEach(route => {
			app.use(['/dc', route.path].join(''), route.router)
		})
        app.get('/health-check', (req, res) => res.send('working'))
    } catch (error) {
        logger.error('Error captured in route init: ', error)
        throw new Error(error)
    }
}

export { Routes }
