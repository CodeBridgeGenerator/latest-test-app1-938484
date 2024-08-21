import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const DocsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [applicationID, setApplicationID] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [applicationID], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.docName)) {
                error["docName"] = `DocName field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.docFileName)) {
                error["docFileName"] = `DocFileName field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.docURL)) {
                error["docURL"] = `DocURL field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            applicationID: _entity?.applicationID?._id,docName: _entity?.docName,docFileName: _entity?.docFileName,docURL: _entity?.docURL,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("docs").create(_data);
        const eagerResult = await client
            .service("docs")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "applicationID",
                    service : "applications",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Docs updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Docs" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount applications
                    client
                        .service("applications")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleApplicationsId } })
                        .then((res) => {
                            setApplicationID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Applications", type: "error", message: error.message || "Failed get applications" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const applicationIDOptions = applicationID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Docs" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="docs-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationID">ApplicationID:</label>
                <Dropdown id="applicationID" value={_entity?.applicationID?._id} optionLabel="name" optionValue="value" options={applicationIDOptions} onChange={(e) => setValByKey("applicationID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationID"]) ? (
              <p className="m-0" key="error-applicationID">
                {error["applicationID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="docName">DocName:</label>
                <InputText id="docName" className="w-full mb-3 p-inputtext-sm" value={_entity?.docName} onChange={(e) => setValByKey("docName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["docName"]) ? (
              <p className="m-0" key="error-docName">
                {error["docName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="docFileName">DocFileName:</label>
                <InputText id="docFileName" className="w-full mb-3 p-inputtext-sm" value={_entity?.docFileName} onChange={(e) => setValByKey("docFileName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["docFileName"]) ? (
              <p className="m-0" key="error-docFileName">
                {error["docFileName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="docURL">DocURL:</label>
                <InputText id="docURL" className="w-full mb-3 p-inputtext-sm" value={_entity?.docURL} onChange={(e) => setValByKey("docURL", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["docURL"]) ? (
              <p className="m-0" key="error-docURL">
                {error["docURL"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(DocsCreateDialogComponent);
