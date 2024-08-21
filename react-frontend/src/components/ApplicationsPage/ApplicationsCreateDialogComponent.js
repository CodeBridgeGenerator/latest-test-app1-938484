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
import { InputTextarea } from 'primereact/inputtextarea';

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

const ApplicationsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [members, setMembers] = useState([])
const [applicationTypeID, setApplicationTypeID] = useState([])
const [refInstitutionID, setRefInstitutionID] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [members,applicationTypeID,refInstitutionID], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.name)) {
                error["name"] = `Name field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.bioData)) {
                error["bioData"] = `About Me field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.education)) {
                error["education"] = `Education History field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            name: _entity?.name,members: _entity?.members?._id,applicationTypeID: _entity?.applicationTypeID?._id,refInstitutionID: _entity?.refInstitutionID?._id,bioData: _entity?.bioData,education: _entity?.education,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("applications").create(_data);
        const eagerResult = await client
            .service("applications")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "members",
                    service : "users",
                    select:["name"]},{
                    path : "applicationTypeID",
                    service : "applicationType",
                    select:["name"]},{
                    path : "refInstitutionID",
                    service : "refInstitutions",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Applications updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Applications" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setMembers(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

useEffect(() => {
                    // on mount applicationType
                    client
                        .service("applicationType")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleApplicationTypeId } })
                        .then((res) => {
                            setApplicationTypeID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "ApplicationType", type: "error", message: error.message || "Failed get applicationType" });
                        });
                }, []);

useEffect(() => {
                    // on mount refInstitutions
                    client
                        .service("refInstitutions")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleRefInstitutionsId } })
                        .then((res) => {
                            setRefInstitutionID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "RefInstitutions", type: "error", message: error.message || "Failed get refInstitutions" });
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

    const membersOptions = members.map((elem) => ({ name: elem.name, value: elem.value }));
const applicationTypeIDOptions = applicationTypeID.map((elem) => ({ name: elem.name, value: elem.value }));
const refInstitutionIDOptions = refInstitutionID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Applications" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="applications-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="name">Name:</label>
                <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["name"]) ? (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="members">Members:</label>
                <Dropdown id="members" value={_entity?.members?._id} optionLabel="name" optionValue="value" options={membersOptions} onChange={(e) => setValByKey("members", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["members"]) ? (
              <p className="m-0" key="error-members">
                {error["members"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationTypeID">Application Type:</label>
                <Dropdown id="applicationTypeID" value={_entity?.applicationTypeID?._id} optionLabel="name" optionValue="value" options={applicationTypeIDOptions} onChange={(e) => setValByKey("applicationTypeID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationTypeID"]) ? (
              <p className="m-0" key="error-applicationTypeID">
                {error["applicationTypeID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="refInstitutionID">Institutions:</label>
                <Dropdown id="refInstitutionID" value={_entity?.refInstitutionID?._id} optionLabel="name" optionValue="value" options={refInstitutionIDOptions} onChange={(e) => setValByKey("refInstitutionID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["refInstitutionID"]) ? (
              <p className="m-0" key="error-refInstitutionID">
                {error["refInstitutionID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="bioData">About Me:</label>
                <InputTextarea id="bioData" rows={5} cols={30} value={_entity?.bioData} onChange={ (e) => setValByKey("bioData", e.target.value)} autoResize  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["bioData"]) ? (
              <p className="m-0" key="error-bioData">
                {error["bioData"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="education">Education History:</label>
                <InputTextarea id="education" rows={5} cols={30} value={_entity?.education} onChange={ (e) => setValByKey("education", e.target.value)} autoResize  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["education"]) ? (
              <p className="m-0" key="error-education">
                {error["education"]}
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

export default connect(mapState, mapDispatch)(ApplicationsCreateDialogComponent);
