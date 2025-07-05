class XRMHelperClass {
    frmContext = null;
    eContextVal = null;
    entityName = "";
    constructor(eContext) {
        this.frmContext = eContext.getFormContext();
        this.eContextVal = eContext;
        this.entityName = this.getEntityName();
    }
    getFieldText(field) {
        'use strict';
        return this.frmContext.getAttribute(field).getText();
    }
    getCurrentFormGUID() {
        return this.frmContext.data.entity.getId();
    }
    getFieldObj(field) {
        'use strict';
        return this.frmContext.getAttribute(field);
    }
    getFieldData(field) {
        'use strict';
        return this.frmContext.getAttribute(field).getValue();
    }
    setFieldData(field, data) {
        'use strict';
        this.frmContext.getAttribute(field).setValue(data);
    }
    getOptionValue(field) {
        'use strict';
        return this.frmContext.ui.controls.get(field);
    }
    enableOrDisableProcess(flag) {
        'use strict';
        this.frmContext.ui.process.setVisible(flag);
    }
    enableOrDisableField(field, flag) {
        'use strict';
        this.frmContext.ui.controls.get(field).setVisible(flag);
    }
    enableOrDisableTab(tab, flag) {
        'use strict';
        this.frmContext.ui.tabs.get(tab).setVisible(flag);
    }
    enableOrDisableSection(tab, section, flag) {
        'use strict';
        this.frmContext.ui.tabs.get(tab).sections.get(section).setVisible(flag);
    }
    setDisplayState(tab, state) {
        'use strict';
        this.frmContext.ui.tabs.get(tab).setDisplayState(state)
    }
    removeOption(control, option) {
        'use strict';
        this.frmContext.getControl(control).removeOption(option)
    }
    enableOrDisableControl(control, flag) {
        'use strict';
        this.frmContext.getControl(control).setDisabled(flag);
    }
    hideOrUnhideControl(control, flag) {
        'use strict';
        this.frmContext.getControl(control).setVisible(flag);
    }
    lockOrUnlockField(field, flag) {
        'use strict';
        this.frmContext.ui.controls.get(field).setDisabled(flag);
    }
    async getOtherEntityData(entity, ODataQuery) {
        'use strict';
        let val = await Xrm.WebApi.retrieveMultipleRecords(entity, ODataQuery);
        return val.entities;
    }
    async getOtherSpecificEntityData(entity, id, ODataQuery) {
        'use strict';
        let val = await Xrm.WebApi.retrieveRecord(entity, id, ODataQuery);
        return val;
    }
    async createNewRecordFromEntity(entity, payload) {
        'use strict';
        let val = await Xrm.WebApi.createRecord(entity, payload);
        return val;
    }
    async updateData(entity, id, payload) {
        let val = await Xrm.WebApi.updateRecord(entity, id, payload);
        return val;
    }
    saveForm(refreshAfter) {
        'use strict';
        if (refreshAfter) {
            this.frmContext.data.save().then(this.refreshData(), function () { });
        }
        else {
            this.frmContext.data.save();
        }
    }
    refreshData() {
        'use strict';
        this.frmContext.data.refresh();
    }
    invokeErrorDialog(details) {
        'use strict';
        Xrm.Navigation.openErrorDialog({ message: details });
    }
    getFormType() {
        'use strict';
        return this.frmContext.ui.getFormType();
    }
    getActiveStage() {
        'use strict';
        return this.frmContext.data.process.getActiveStage().getId();
    }
    getActiveStageObj() {
        return this.frmContext.data.process.getActiveStage();
    }
    setActiveStage(GUID) {
        'use strict';
        this.frmContext.data.process.setActiveProcess(GUID);
    }
    preventSave() {
        'use strict';
        let saveContext = this.eContextVal.getEventArgs();
        saveContext.preventDefault();
    }
    setNewLabel(control, new_name) {
        'use strict';
        this.frmContext.getControl(control).setLabel(new_name);
    }
    setNewTabLabel(tab, new_name) {
        'use strict';
        this.frmContext.ui.tabs.get(tab).setLabel(new_name);
    }
    getStatus() {
        'use strict';
        return this.frmContext.data.process.getStatus();
    }
    getOrgURL() {
        'use strict';
        let globalContext = Xrm.Utility.getGlobalContext();
        return globalContext.getClientUrl();
    }
    getClient() {
        'use strict';
        return Xrm.Utility.getGlobalContext().client
    }
    getGridCount(control) {
        'use strict';
        return this.frmContext.getControl(control).getGrid().getTotalRecordCount();
    }
    getRows(control) {
        'use strict';
        return this.frmContext.getControl(control).getGrid().getRows();
    }
    getGridObj(control) {
        return this.frmContext.getControl(control).getGrid();
    }
    getUserID() {
        'use strict';
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        return userSettings.userId;
    }
    getUserName() {
        'use strict';
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        return userSettings.userName;
    }
    checkIfUserHasRole(role) {
        var roles = Xrm.Utility.getGlobalContext().userSettings.roles;
        let has_role = false;
        roles.forEach(function hasRoleName(item, index) {
            //Check passed in value for role[].name match 
            if (item.name === role) {
                //match found set return value to true
                has_role = true;
            };
        });
        return has_role;
    }
    setFocus(field) {
        'use strict';
        this.frmContext.getControl(field).setFocus();
    }
    setFieldsRequiredLevel(ShowFields, level) {
        'use strict';
        if (typeof ShowFields === "string") {
            this.frmContext.getAttribute(ShowFields).setRequiredLevel(level);
        }
        else if (typeof ShowFields === "object") {
            for (var i = 0; i < ShowFields.length; i++) {
                this.frmContext.getAttribute(ShowFields[i]).setRequiredLevel(level);
            }
        }
    }
    addOnProcessStatusChange(func) {
        'use strict';
        this.frmContext.data.process.addOnProcessStatusChange(func);
    }
    addOnStageChange(func) {
        'use strict';
        this.frmContext.data.process.addOnStageChange(func);
    }
    addOnChange(field, func) {
        'use strict';
        this.frmContext.data.entity.attributes.get(field).addOnChange(func);
    }
    addOnSave(func) {
        'use strict';
        this.frmContext.data.entity.addOnSave(func);
    }
    setFormNotification(message, level, uniqueId) {
        'use strict';
        this.frmContext.ui.setFormNotification(message, level, uniqueId);
    }
    setFormNotificationWithOptions(message, type, name) {
        'use strict';
        this.frmContext.ui.setFormNotification(message, type, name);
    }
    clearFormNotification(args) {
        'use strict';
        this.frmContext.ui.clearFormNotification(args);
    }
    addOnLoadComponent(component, func) {
        'use strict';
        this.frmContext.getControl(component).addOnLoad(func);
    }
    moveToPreviousStage() {
        'use strict';
        this.frmContext.data.process.movePrevious();
    }
    moveToNextStage(callback1, callback2) {
        'use strict';
        this.frmContext.data.process.moveNext(callback1, callback2);
    }
    getControlObj(control) {
        'use strict';
        return this.frmContext.getControl(control);
    }
    setDefaultView(control, GUID) {
        'use strict';
        this.frmContext.getControl(control).setDefaultView(GUID);
    }
    addPreSearchToLookup(control, func) {
        'use strict';
        this.frmContext.getControl(control).addPreSearch(func);
    }
    addCustomFilter(control, fetchXML) {
        'use strict';
        this.frmContext.getControl(control).addCustomFilter(fetchXML);
    }
    openForm(entityFormOptions, parameters) {
        'use strict';
        Xrm.Navigation.openForm(entityFormOptions, parameters);
    }
    getFieldSelectedOption(field) {
        return this.frmContext.getAttribute(field).getSelectedOption()
    }
    getAttribCollection() {
        'use strict';
        return this.frmContext.data.entity.attributes.get();
    }
    setSrc(control, src) {
        'use strict';
        this.frmContext.getControl(control).setSrc(src);
    }
    refreshRibbon(refreshAll) {
        'use strict';
        this.frmContextui.refreshRibbon(refreshAll);
    }
    getEntityName() {
        'use strict';
        return this.frmContext.data.entity.getEntityName();
    }
    closeForm() {
        this.frmContext.ui.close();
    }
    setFieldNotification(field, message) {
        this.frmContext.getControl(field).setNotification(message);
    }
    getQueryParameters() {
        return this.frmContext.data.attributes;
    }
    setSubGridFetchXml(subgridObj, fetchXML) {
        subgridObj.setFilterXml(fetchXML); //set the fetch xml to the sub grid (WARNING NOT DOCUMENTED BY MICROSOFT)
        subgridObj.refresh();
    }
}