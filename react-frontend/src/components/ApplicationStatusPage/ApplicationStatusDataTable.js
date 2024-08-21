import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useParams } from "react-router-dom";
import moment from "moment";
import UploadService from "../../services/uploadService";
import { InputText } from 'primereact/inputtext';
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import DownloadCSV from "../../utils/DownloadCSV";

const ApplicationStatusDataTable = ({ items, fields, onEditRow, onRowDelete, onRowClick, searchDialog, setSearchDialog,   showUpload, setShowUpload,
    showFilter, setShowFilter,
    showColumns, setShowColumns, onClickSaveFilteredfields ,
    selectedFilterFields, setSelectedFilterFields,
    selectedHideFields, setSelectedHideFields, onClickSaveHiddenfields, loading}) => {
    const dt = useRef(null);
    const urlParams = useParams();
    const [globalFilter, setGlobalFilter] = useState('');

const dropdownTemplate0 = (rowData, { rowIndex }) => <p >{rowData.applicationID?.name}</p>
const dropdownArrayTemplate1 = (rowData, { rowIndex }) => <p >{rowData.applicationStatus}</p>
const calendarTemplate2 = (rowData, { rowIndex }) => <p>{new Date(rowData.applicationSentDate).toLocaleDateString()}</p>
const dropdownArrayTemplate3 = (rowData, { rowIndex }) => <p >{rowData.institutionStatus}</p>
const calendarTemplate4 = (rowData, { rowIndex }) => <p>{new Date(rowData.institutionRespondedDate).toLocaleDateString()}</p>
const dropdownArrayTemplate5 = (rowData, { rowIndex }) => <p >{rowData.applicationNotiStatus}</p>
const calendarTemplate6 = (rowData, { rowIndex }) => <p>{new Date(rowData.applicationNotiSentDate).toLocaleDateString()}</p>
    const editTemplate = (rowData, { rowIndex }) => <Button onClick={() => onEditRow(rowData, rowIndex)} icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`} className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`} />;
    const deleteTemplate = (rowData, { rowIndex }) => <Button onClick={() => onRowDelete(rowData._id)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />;
    const pCreatedAt = (rowData, { rowIndex }) => <p>{moment(rowData.createdAt).fromNow()}</p>;
    const pUpdatedAt = (rowData, { rowIndex }) => <p>{moment(rowData.updatedAt).fromNow()}</p>;
    const pCreatedBy = (rowData, { rowIndex }) => <p>{rowData.createdBy?.name}</p>;
    const pUpdatedBy = (rowData, { rowIndex }) => <p>{rowData.updatedBy?.name}</p>;
    const paginatorLeft = <Button type="button" icon="pi pi-upload" text onClick={() => setShowUpload(true)} disabled={!false}/>;
    const paginatorRight = DownloadCSV({ data : items, fileName : "applicationStatus"});
    const exportCSV = () => {dt.current?.exportCSV();};

    return (
        <>
        <DataTable value={items} ref={dt} removableSort onRowClick={onRowClick} scrollable rowHover stripedRows paginator rows={10} rowsPerPageOptions={[10, 50, 250, 500]} size={"small"}  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} rowClassName="cursor-pointer" alwaysShowPaginator={!urlParams.singleUsersId} loading={loading}>
<Column field="applicationID" header="ApplicationID" body={dropdownTemplate0} filter={selectedFilterFields.includes("applicationID")} hidden={selectedHideFields?.includes("applicationID")}  style={{ minWidth: "8rem" }} />
<Column field="applicationStatus" header="Status" body={dropdownArrayTemplate1} filter={selectedFilterFields.includes("applicationStatus")} hidden={selectedHideFields?.includes("applicationStatus")}  style={{ minWidth: "8rem" }} />
<Column field="applicationSentDate" header="Sent Date" body={calendarTemplate2} filter={selectedFilterFields.includes("applicationSentDate")} hidden={selectedHideFields?.includes("applicationSentDate")}  sortable style={{ minWidth: "8rem" }} />
<Column field="institutionStatus" header="Institution Response Status" body={dropdownArrayTemplate3} filter={selectedFilterFields.includes("institutionStatus")} hidden={selectedHideFields?.includes("institutionStatus")}  style={{ minWidth: "8rem" }} />
<Column field="institutionRespondedDate" header="Institution Responded Date" body={calendarTemplate4} filter={selectedFilterFields.includes("institutionRespondedDate")} hidden={selectedHideFields?.includes("institutionRespondedDate")}  sortable style={{ minWidth: "8rem" }} />
<Column field="applicationNotiStatus" header="Notification Status" body={dropdownArrayTemplate5} filter={selectedFilterFields.includes("applicationNotiStatus")} hidden={selectedHideFields?.includes("applicationNotiStatus")}  style={{ minWidth: "8rem" }} />
<Column field="applicationNotiSentDate" header="Notification Sent Date" body={calendarTemplate6} filter={selectedFilterFields.includes("applicationNotiSentDate")} hidden={selectedHideFields?.includes("applicationNotiSentDate")}  sortable style={{ minWidth: "8rem" }} />
            <Column header="Edit" body={editTemplate} />
            <Column header="Delete" body={deleteTemplate} />
            {/*<Column field="createdAt" header="created" body={pCreatedAt} sortable style={{ minWidth: "8rem" }} />*/}
            {/*<Column field="updatedAt" header="updated" body={pUpdatedAt} sortable style={{ minWidth: "8rem" }} />*/}
            {/*<Column field="createdBy" header="createdBy" body={pCreatedBy} sortable style={{ minWidth: "8rem" }} />*/}
            {/*<Column field="updatedBy" header="updatedBy" body={pUpdatedBy} sortable style={{ minWidth: "8rem" }} />*/}
        </DataTable>
        <Dialog header="Upload ApplicationStatus Data" visible={showUpload} onHide={() => setShowUpload(false)}>
        <UploadService />
      </Dialog>

      <Dialog header="Search ApplicationStatus" visible={searchDialog} onHide={() => setSearchDialog(false)}>
      Search
    </Dialog>
    <Dialog
        header="Filter Users"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedFilterFields}
            onChange={(e) => setSelectedFilterFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedFilterFields);
            onClickSaveFilteredfields(selectedFilterFields);
            setSelectedFilterFields(selectedFilterFields);
            setShowFilter(false)
          }}
        ></Button>
      </Dialog>

      <Dialog
        header="Hide Columns"
        visible={showColumns}
        onHide={() => setShowColumns(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedHideFields}
            onChange={(e) => setSelectedHideFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedHideFields);
            onClickSaveHiddenfields(selectedHideFields);
            setSelectedHideFields(selectedHideFields);
            setShowColumns(false)
          }}
        ></Button>
      </Dialog>
        </>
    );
};

export default ApplicationStatusDataTable;