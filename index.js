import React, {useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import styled from 'styled-components'


const UseForms = (initialState, validate) => {
    const [submitted, setSubmitted] = useState(false)
    const [invalidInputs, setInvalidInputs] = useState([])
    
    let formData = initialState || {}
    const updateForm = (prop, type) => ev => {
        switch(type){
            case "checkbox": return formData[prop] = ev.target.checked ? "J" : "N"
            case "number": return formData[prop] = Number(ev.target.value)
            case "select-num": return formData[prop] = Number(ev.target.value)
            default: return formData[prop] = ev.target.value  
        }
    }

    const setDefaultFormData = children => {
        const setStringAsDefault = (c) => { 
            formData = c.props.id ? { ...formData, [c.props.id]:""} : formData
        }
        React.Children.map(children, setStringAsDefault)
    }
    
    const InputForm = ({ label, placeholder, id, type }) => {
        const inValid = invalidInputs.find(x => x.key == id)
        return (
            <Form.Group controlId={id} className="w-25">
                <Form.Label>{label}</Form.Label>
                <Form.Control className={inValid && "border-danger"} type={type} onChange={updateForm(id, type)} placeholder={placeholder} />
                <FormText className="text-danger">
                    {inValid && inValid.msg}
                </FormText>
            </Form.Group>
        )
    }

    const SelectForm = ({ label, id, data, type }) => {
        const inValid = invalidInputs.find(x => x.key == id)
        return (
            <Form.Group className="w-25" controlId={id}>
                <Form.Label>{label}</Form.Label>
                <Form.Control  
                    className={inValid && "border-danger"} 
                    onChange={updateForm(id, type)} 
                    as="select"
                >
                    <option value="">Velg</option>
                    {Object.keys(data).map(key => 
                        <option key={key} value={key}>{data[key]}</option>)
                    }
                </Form.Control>
                <FormText className="text-danger">
                    {inValid && inValid.msg}
                </FormText>
            </Form.Group>
        )
    }

    const CheckboxForm = ({ label, id }) => {
        const inValid = invalidInputs.find(x => x.key == id)
        return (
            <Form.Group controlId={id}>
                <Form.Check onClick={updateForm(id, "checkbox")} type="checkbox" label={label} />
                <FormText className="text-danger">
                    {inValid && inValid.msg}
                </FormText>
            </Form.Group>
        )
    }

    const SubmitButton = ({ variant, text}) => {
        return <Button variant={variant} type="submit">{text}</Button>
    }

    const SuccessMessage = ({ text }) => {
        return submitted && <FormMessage>{ text }</FormMessage>
    }

    const FormWrapper = ({ children, onSubmit }) => {
        setDefaultFormData(children)

        const submit = (ev) => {
            ev.preventDefault()
            const errorMessages = validate(validationMethods(formData)).filter(x => x)

            if(errorMessages.length > 0){
                return setInvalidInputs(errorMessages)
            }
            
            return onSubmit(formData, () => {
                setSubmitted(true)
                setInvalidInputs([])
            })
        }
        return <Form onSubmit={submit}>{children}</Form>
    }
    
    return [ FormWrapper,
    {
        Text(props){
            return InputForm({ ...props, type:"text"})
        },
        Date(props){
            return InputForm({ ...props, type:"date"})
        },
        Num(props){
            return InputForm({ ...props, type:"number"})
        },
        SelectNum(props){
            return SelectForm({ ...props, type:"select-num"})
        },
        Select(props){
            return SelectForm(props)
        },
        Checkbox(props){
            return CheckboxForm(props)
        },
        Submit(props){
            return SubmitButton(props)
        },
        SuccessMessage(props){
            return SuccessMessage(props)
        }
    }]
}

const validationMethods = formData => key => {
    const val = formData[key]
    let invalid = false
    
    return {
        notEmpty(){
            invalid = val === ""
            return this 
        },
        not(compare){
            invalid = val === compare
            return this
        },
        lessThan(compare){
            invalid = Number(val) > compare
            return this
        },
        largerThan(compare){
            invalid = Number(val) < compare
            return this
        },
        withMsg(msg){
            if(invalid){
                return { key, msg }
            }
        }
    }
}

const FormText = styled(Form.Text)`
    height: 5px;
`

const FormMessage = styled.div`
    margin-top: 15px;
    font-size: 16px;
    font-weight: bold;
`

export default UseForms
