import React from 'react'
import LocaleContext from '../../state/contexts/LocaleContext'
import { messages } from './newCase.i18n'
import casesInstance from '../../Instances/axios-cases'
import WindowContainer from '../../components/UI/Widgets/WindowContainer'
import { parseToken } from '../../Utility/ParseToken'
import UseForms from './UseForms'
    

const NewCase = () => {
    const locale = React.useContext(LocaleContext);
    const { caption, detbitorNr, debitorNavn, fakturanr, forfall, belop, sistePurreDato, saldo, tvist, status, leggtil } = messages[locale]
    
    const initialFormState = { "tvist": "N" } 
    const [Form, Forms] = UseForms(initialFormState, validate)
    const kreditors = createKreditors()

    return (
        <WindowContainer caption={caption}>
            <Form onSubmit={submitHandler}>
                <Forms.Text label={detbitorNr} id="detbitorNr" placeholder={detbitorNr} />
                <Forms.Text label={debitorNavn} id="debitorNavn" placeholder={debitorNavn} />
                <Forms.Text label={fakturanr} id="fakturanr" placeholder={fakturanr} />
                <Forms.Date label={forfall} id="forfall" />
                <Forms.Num label={belop} id="belop" placeholder={belop} />
                <Forms.Date label={sistePurreDato} id="sistePurreDato" />
                <Forms.Num label={saldo} id="saldo" placeholder={saldo} />
                <Forms.SelectNum label={"Kreditors"} id="kreditorId" data={kreditors} />
                <Forms.Select label={"Status"} id="status" data={status} />
                <Forms.Checkbox label={tvist} id="tvist" />
                <Forms.Submit text={leggtil} variant="primary" />
                <Forms.SuccessMessage text="Ny sak ble lagret" />
            </Form>
        </WindowContainer>
    )
}

const submitHandler = (data, showSuccessMessage) => {
    casesInstance.post("", data).then(showSuccessMessage)
}

const validate = (validator) => [
    validator("detbitorNr").notEmpty().withMsg("Debitor nr. kan ikke være tom"),
    validator("debitorNavn").notEmpty().withMsg("Debitor navn kan ikke være tom"),
    validator("fakturanr").notEmpty().withMsg("Faktura nr. kan ikke være tom"),
    validator("forfall").notEmpty().withMsg("Forfall kan ikke være tom"),
    validator("belop").notEmpty().withMsg("Beløp kan ikke være tom"),
    validator("sistePurreDato").notEmpty().withMsg("Siste purre dato kan ikke være tom"),
    validator("saldo").notEmpty().withMsg("Saldo kan ikke være tom"),
    validator("kreditorId").notEmpty().withMsg("Du må velge en kreditor"),
    validator("status").notEmpty().withMsg("Du må velge en status"),
]

const createKreditors = () => {
    const parsedToken = parseToken()    

    const kreditorReducer = (kreditors, curr) => {
        if(curr.includes("Kreditor")){
            kreditors[parsedToken[curr]] = curr.replace("Kreditor:", "")
        }
        return kreditors
    }
    
    return Object
        .keys(parsedToken)
        .reduce(kreditorReducer, {})
}


export default NewCase
