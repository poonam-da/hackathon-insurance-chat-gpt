import cls from 'cls-hooked'

const ns = cls.createNamespace('logger')

export const context = {
  middleware,
  get,
  set
}

function middleware(request, response, next) {
  ns.run(() => next())
}

function get(key) {
  if (ns?.active) {
    return ns.get(key)
  }
}

function set(key, value) {
  if (ns?.active) {
    return ns.set(key, value)
  }
}
