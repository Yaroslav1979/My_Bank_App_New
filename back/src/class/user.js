class User {
    static #list = []
    static #count = Math.floor(Math.random() * 90000) + 10000;

    constructor(email, password) {
        this.id = User.#count++
        this.email = email
        this.password = password
        this.date = new Date().getTime()
    }

    verifyPassword = (password) => this.password === password

       static add = (user) => {
        this.#list.push(user)
      }
    
      static getList = () => {
        return this.#list
      }
    
      static getById = (id) => {
        return this.#list.find((user) => user.id === id)
      }
    
      static deleteById = (id) => {
        const index = this.#list.findIndex(
          (user) => user.id === id,
          )
          if (index !== -1) {
            this.#list.splice(index, 1);
            return true
          } else {
            return false
          }
      }
    
      static updateById = (id, data) => {
        const user = this.getById(id);
    
        if (user) {
          this.update(user, data)
    
            return true
          } else {
            return false
          }
          }
    
      static update = (user, {email} ) => {
        if (email) {
          user.email = email
        }
      }
}