using { transporterdata as external } from './external/transporterdata';
service transdata {

    entity DispTranspDataType as projection on external.DispTranspData {
        Vbeln, Vehno, Transgstn, Enteredby, Entereddt, Enteredtm
    };
    entity UpdateTranspDataType as projection on external.UpdateTranspData{
        Vbeln, Vehno, Transgstn
    };
}
