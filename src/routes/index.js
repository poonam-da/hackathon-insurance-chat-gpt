import { ChatRouter } from './Chat'
import { AuthRouter } from './Auth'
// import { MemberRouter } from './Member'

const Routes = [
    { path: '/chat', router: ChatRouter },
    { path: '/auth', router: AuthRouter },
    // { path: '/member', router: MemberRouter },
    
]

Routes.init = (app) => {
    try {
        Routes.forEach(route => {
			app.use(['', route.path].join(''), route.router)
		})
        app.get('/health-check', (req, res) => res.send('working'))
    } catch (error) {
        logger.error('Error captured in route init: ', error)
        throw new Error(error)
    }
}
export { Routes }
