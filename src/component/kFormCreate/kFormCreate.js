import React, {Component} from 'react'

export function kFormCreate(Comp) {
  return class extends Component {
    constructor() {
      super(...arguments)
      //
      this.options = {}
      this.state = {}
    }

    handleChange = e => {
      let {name, value} = e.target
      this.setState(
        {
          [name]: value
        },
        () => {
          this.validateField(name)
        }
      )
    }
    validateField = field => {
      const rules = this.options[field].rules;
      const ret = !rules.some((rule => {
        if (rule.required) {
          if (!this.state[field]) {
            this.setState({
              [field + "Message"]: rule.message
            })
            return true
          }
        }
      }))

      if (ret) this.setState({
        [field + "Message"]: ""
      })

      return ret
    }

    validate = cb => {
      const ret = Object.keys(this.options).every(field => {
        return this.validateField(field)
      })
      cb(ret, this.state)
    }

    getFieldDec = (field, option) => {
      this.options[field] = option
      return InputComp => (
        <div>
          {React.cloneElement(InputComp, {
            name: field,
            value: this.state[field] || '',
            onChange: this.handleChange
          })}
          {
            this.state[field + "Message"] &&
            (
              <p style={{color: 'red'}}>{this.state[field + 'Message']}</p>
            )
          }
        </div>
      )
    }

    render() {
      return (
        <div>
          <Comp
            {...this.props}
            getFieldDec={this.getFieldDec}
            validate={this.validate}
          />
        </div>
      )
    }
  }
}
