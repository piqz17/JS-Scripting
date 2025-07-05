var helper = null;
var subGridName;
function onLoadEvent(eContext) {
    'use strict';
    helper = new XRMHelperClass(eContext);
    filterProductSampleTransactions();
}


async function filterOpenTasks() {
    let tableName = helper.getEntityName();
    let subGridName;

    // Determine subgrid name based on the entity (Account or Contact)
    if (tableName === "account") {
        subGridName = "Subgrid_new_2"; // Account-specific subgrid
    } else if (tableName === "contact") {
        subGridName = "Subgrid_new_4"; // Contact-specific subgrid
    }

    console.log("Entity Name:", tableName);
    console.log("Subgrid Name:", subGridName);

    let subGrid = helper.getControlObj(subGridName); // Subgrid to filter
    let regardingObjectId = helper.getCurrentFormGUID(); // Get current record's ID (e.g., Contact or Account)

    let fetchXml = [
        "<fetch version='1.0' mapping='logical'>",
        "  <entity name='activitypointer'>",  // Keep 'activitypointer' to cover all activity types
        "    <attribute name='subject'/>",
        "    <attribute name='activitytypecode'/>",
        "    <attribute name='regardingobjectid'/>",
        "    <attribute name='ownerid'/>",
        "    <attribute name='prioritycode'/>",
        "    <attribute name='scheduledstart'/>",
        "    <attribute name='scheduledend'/>",
        "    <attribute name='statecode'/>",
        "    <order attribute='scheduledend' descending='false'/>",  // Order by Due Date
        "    <filter type='and'>",
        "      <condition attribute='regardingobjectid' operator='eq' value='", regardingObjectId, "'/>",  // Filter by current record (Account/Contact)
        "      <condition attribute='activitytypecode' operator='eq' value='4212'/>",  // Filter for tasks only ('4212' is the activity type code for tasks)
        "      <condition attribute='statecode' operator='eq' value='0'/>",  // Filter for "open" tasks (statecode 0)
        "    </filter>",
        "  </entity>",
        "</fetch>"
    ].join("");

    helper.setSubGridFetchXml(subGrid, fetchXml);
}

async function filterTaskDueThisWeek() {
    let tableName = helper.getEntityName();
    let subGridName;

    // Determine subgrid name based on the entity (Account or Contact)
    if (tableName === "account") {
        subGridName = "Subgrid_new_2"; // Account-specific subgrid
    } else if (tableName === "contact") {
        subGridName = "Subgrid_new_4"; // Contact-specific subgrid
    }

    console.log("Entity Name:", tableName);
    console.log("Subgrid Name:", subGridName);

    let subGrid = helper.getControlObj(subGridName); // Subgrid to filter
    let regardingObjectId = helper.getCurrentFormGUID(); // Get current record's ID (Contact or Account)

    let today = new Date();
    let startOfWeek = new Date(today);
    let endOfWeek = new Date(today);

    // Calculate the end of the current week
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    let startOfWeekString = startOfWeek.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
    let endOfWeekString = endOfWeek.toISOString().split('T')[0];

    let fetchData = {
        "statecode": "0", // Filter for open activities
        "regardingobjectid": regardingObjectId,
        "startOfWeek": startOfWeekString,
        "endOfWeek": endOfWeekString
    };

    let fetchXml = [
        "<fetch version='1.0' mapping='logical'>",
        "  <entity name='activitypointer'>",  // ActivityPointer entity covers all activity types
        "    <attribute name='subject'/>",
        "    <attribute name='regardingobjectid'/>",
        "    <attribute name='activitytypecode'/>",
        "    <attribute name='ownerid'/>",
        "    <attribute name='prioritycode'/>",
        "    <attribute name='scheduledstart'/>",
        "    <attribute name='scheduledend'/>",
        "    <attribute name='statecode'/>",
        "    <order attribute='scheduledend' descending='false'/>", // Order by Due Date
        "    <filter type='and'>",
        "      <condition attribute='statecode' operator='eq' value='", fetchData.statecode, "'/>", // Only open activities
        "      <condition attribute='regardingobjectid' operator='eq' value='", fetchData.regardingobjectid, "'/>", // Filter by current record
        "      <condition attribute='scheduledend' operator='on-or-after' value='", fetchData.startOfWeek, "'/>", // Due after start of week
        "      <condition attribute='scheduledend' operator='on-or-before' value='", fetchData.endOfWeek, "'/>", // Due by end of week
        "      <condition attribute='activitytypecode' operator='eq' value='4212'/>",  // Filter for tasks only ('4212' is the activity type code for tasks)
        "    </filter>",
        "  </entity>",
        "</fetch>"
    ].join("");

    helper.setSubGridFetchXml(subGrid, fetchXml);
}


async function filterOpenAppointments() {
    let tableName = helper.getEntityName();
    let subGridName;

    // Determine subgrid name based on the entity (Account or Contact)
    if (tableName === "account") {
        subGridName = "Subgrid_new_2"; // Account-specific subgrid
    } else if (tableName === "contact") {
        subGridName = "Subgrid_new_4"; // Contact-specific subgrid
    }

    console.log("Entity Name:", tableName);
    let subGrid = helper.getControlObj(subGridName); // Subgrid to filter
    let regardingObjectId = helper.getCurrentFormGUID(); // Get current record's ID (e.g., Contact or Account)

    // Define the FetchXML query for open appointments
    let fetchXml = [
        "<fetch version='1.0' mapping='logical'>",
        "  <entity name='activitypointer'>",  // Still 'activitypointer' to cover all activities
        "    <attribute name='subject'/>",
        "    <attribute name='activitytypecode'/>",
        "    <attribute name='regardingobjectid'/>",
        "    <attribute name='ownerid'/>",
        "    <attribute name='prioritycode'/>",
        "    <attribute name='scheduledstart'/>",
        "    <attribute name='scheduledend'/>",
        "    <attribute name='statecode'/>",
        "    <order attribute='scheduledend' descending='false'/>",  // Order by Due Date
        "    <filter type='and'>",
        "      <condition attribute='regardingobjectid' operator='eq' value='", regardingObjectId, "'/>",  // Filter by current record (Account/Contact)
        "      <condition attribute='activitytypecode' operator='eq' value='4201'/>",  // Filter for appointments only ('4201' is the activity type code for appointments)
        "      <condition attribute='statecode' operator='eq' value='0'/>",  // Filter for "open" appointments (statecode 0)
        "    </filter>",
        "  </entity>",
        "</fetch>"
    ].join("");

    // Apply the FetchXML to the subgrid
    helper.setSubGridFetchXml(subGrid, fetchXml);
}

async function filterAppointmentDueThisWeek() {
    let tableName = helper.getEntityName();
    let subGridName;

    // Determine subgrid name based on the entity (Account or Contact)
    if (tableName === "account") {
        subGridName = "Subgrid_new_2"; // Account-specific subgrid
    } else if (tableName === "contact") {
        subGridName = "Subgrid_new_4"; // Contact-specific subgrid
    }

    console.log("Entity Name:", tableName);
    let subGrid = helper.getControlObj(subGridName); // Subgrid to filter
    let regardingObjectId = helper.getCurrentFormGUID(); // Get current record's ID (e.g., Contact or Account)

    let today = new Date();
    let startOfWeek = today;
    let endOfWeek = new Date();

    // Calculate the end of the current week
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    let startOfWeekString = startOfWeek.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
    let endOfWeekString = endOfWeek.toISOString().split('T')[0];

    // Create FetchXML for filtering appointments due this week
    let fetchXml = [
        "<fetch version='1.0' mapping='logical'>",
        "  <entity name='activitypointer'>",  // ActivityPointer entity covers all activity types
        "    <attribute name='subject'/>",
        "    <attribute name='regardingobjectid'/>",
        "    <attribute name='activitytypecode'/>",
        "    <attribute name='ownerid'/>",
        "    <attribute name='prioritycode'/>",
        "    <attribute name='scheduledstart'/>",
        "    <attribute name='scheduledend'/>",
        "    <attribute name='statecode'/>",
        "    <order attribute='scheduledend' descending='false'/>", // Order by Due Date
        "    <filter type='and'>",
        "      <condition attribute='statecode' operator='eq' value='0'/>", // Open activities only
        "      <condition attribute='regardingobjectid' operator='eq' value='", regardingObjectId, "'/>", // Activities regarding the current record
        "      <condition attribute='scheduledend' operator='on-or-after' value='", startOfWeekString, "'/>", // Due this week
        "      <condition attribute='scheduledend' operator='on-or-before' value='", endOfWeekString, "'/>",
        "      <condition attribute='activitytypecode' operator='eq' value='4201'/>",  // Appointments only
        "    </filter>",
        "  </entity>",
        "</fetch>"
    ].join("");

    // Apply the FetchXML to the subgrid
    helper.setSubGridFetchXml(subGrid, fetchXml);
}



async function quickCreateActivity() {
    let currentGUID = helper.getCurrentFormGUID();
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "task"; // e.g., "task", "phonecall", "email"
    entityFormOptions["useQuickCreateForm"] = true; // Opens the Quick Create form

    // Parameters to pre-fill data
    var formParameters = {
        "regardingobjectid": currentGUID, // Regarding record ID
        "regardingobjectidname": "Wade Wilson", // Regarding record name
        "regardingobjectidtype": "contact" // Regarding object type (e.g., contact, account)
    };

    // Open the form
    helper.openForm(entityFormOptions, formParameters);
    return;
}


async function quickCreateFlora() {
    let entityName = helper.getEntityName();
    let currentGUID = helper.getCurrentFormGUID();
    
    var entityFormOptions = {
        entityName: "hhsg_florarequest",
        useQuickCreateForm: true
    };

    // Declare formParameters and set based on entity type
    var formParameters = {};

    if (entityName === "account") {
        let accountname = helper.getFieldData("name"); // For account
        formParameters = {
            "hhsg_recipientcompanyname": {
                entityType: "account",
                id: currentGUID,
                name: accountname
            }
        };
    } else if (entityName === "contact") {

       // Fetch the contact details including the parent account GUID
        let contactData = await helper.getOtherEntityData("contact", "?$filter=contactid eq " + currentGUID);
        
        
        if (contactData.length > 0) {
            // Get the parent account GUID from the contact data
            let accountId = contactData[0]._parentcustomerid_value;
            let recipientContact = contactData[0].fullname;
            let recipientContactNumber = contactData[0].mobilephone || "";

            // Fetch the account details to retrieve the account name
            let accountData = await helper.getOtherEntityData("account", "?$filter=accountid eq " + accountId);

            if (accountData.length > 0) {
                let companyName =  accountData[0].name || "";
                let deliveryAdd = accountData[0].address1_composite || "";

                formParameters = {
                    "hhsg_recipientcompanyname": {
                        entityType: "contact",
                        id: currentGUID,
                        name: companyName
                    },
                    
                    "hhsg_recipientcontactperson": {
                        entityType: "contact",
                        id: currentGUID,
                        name: recipientContact
                    },
                    "hhsg_recipientcontactname": recipientContact,
                    "hhsg_recipientcontactnumber": recipientContactNumber,
                    "hhsg_deliveryaddress": deliveryAdd
                };

            }
                   
           
        }
    }

    // Open the form with the appropriate parameters
    await helper.openForm(entityFormOptions, formParameters);
}



async function quickCreatePriceChangeApplication() {
    try {
        var requestType = "Price Change Application";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateBusinessDevelopment() {
    try {
        var requestType = "Special Approvals - Business Development";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateCustomerServices() {
    try {
        var requestType = "Special Approvals - Customer Services";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateCustomerServicesAfterSales() {
    try {
        var requestType = "Special Approvals - Customer Services After Sales";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateDrafting() {
    try {
        var requestType = "Special Approvals - Drafting";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateProjectManagement() {
    try {
        var requestType = "Special Approvals - Project Management";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateSalesSG() {
    try {
        var requestType = "Special Approvals - Sales SG";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}
async function quickCreateSalesMY() {
    try {
        var requestType = "Special Approvals - Sales MY";
        await quickCreateCustomApproval(requestType);
    } catch (error) {
        console.error("Error in quickCreatePriceChangeApplication:", error);
    }
}


async function quickCreateCustomApproval(requestType) {
    let entityName = await helper.getEntityName(); // Get the current entity type

    // Only proceed if the entity is "account"
    if (entityName !== "account") {
        console.warn("This function is only available for the Account entity.");
        return; // Exit the function early if the entity is not "account"
    }

    let currentGUID = await helper.getCurrentFormGUID();
    let accountName = await helper.getFieldData("name");

    // Set requestTypeValue based on the selected requestType
    let requestTypeValue;
    switch (requestType) {
        case "Price Change Application":
            requestTypeValue = 1;
            break;
        case "Special Approvals - Business Development":
            requestTypeValue = 3;
            break;
        case "Special Approvals - Customer Services":
            requestTypeValue = 4;
            break;
        case "Special Approvals - Customer Services After Sales":
            requestTypeValue = 5;
            break;
        case "Special Approvals - Drafting":
            requestTypeValue = 6;
            break;
        case "Special Approvals - Project Management":
            requestTypeValue = 7;
            break;
        case "Special Approvals - Sales SG":
            requestTypeValue = 8;
            break;
        case "Special Approvals - Sales MY":
            requestTypeValue = 9;
            break;
        default:
            console.warn("Invalid request type.");
            return; // Exit if the request type is invalid
    }

    var entityFormOptions = {
        entityName: "kp_requestforapproval",
        useQuickCreateForm: true
    };

    // Parameters to pre-fill data
    var formParameters = {
        "kp_account": {
            entityType: "account",
            id: currentGUID,
            name: accountName || ""
        },
        "kp_requestregardingaccount": requestTypeValue
    };

    // Open the form
    await helper.openForm(entityFormOptions, formParameters);

    // Clear requestType variables after use
    requestType = null;
    requestTypeValue = null;
}



async function filterProductSampleTransactions() {

    let tableName = helper.getEntityName();

    if (tableName === "account") {
        // Account-specific logic
        helper.hideOrUnhideControl("Subgrid_new_14", true);
        helper.hideOrUnhideControl("Subgrid_new_15", false);
        helper.hideOrUnhideControl("Subgrid_new_17", false);
    } else if (tableName === "contact") {
        // Contact-specific logic
        helper.hideOrUnhideControl("Subgrid_new_1", true); // Product Sample subgrid
        helper.hideOrUnhideControl("Subgrid_new_6", false); // Flora subgrid
        helper.hideOrUnhideControl("Timeline", false);
    } else {
        // Logic for other entities or fallback if needed
        helper.hideOrUnhideControl("Subgrid_new_4", true); // Example for other entities
    }


}


async function filterFloraRequests() {
    let tableName = helper.getEntityName();

    if (tableName === "account") {
        // Account-specific logic
        helper.hideOrUnhideControl("Subgrid_new_14", true);
        helper.hideOrUnhideControl("Subgrid_new_15", false);
        helper.hideOrUnhideControl("Subgrid_new_17", false);
    } else if (tableName === "contact") {
        // Contact-specific logic
        helper.hideOrUnhideControl("Subgrid_new_1", false); // Product Sample subgrid
        helper.hideOrUnhideControl("Subgrid_new_6", true); // Flora subgrid
        //helper.hideOrUnhideControl("Timeline", false);
    } else {
        // Logic for other entities or fallback if needed
        helper.hideOrUnhideControl("Subgrid_new_4", true); // Example for other entities
    }
}



async function filterCustomApproval() {
    helper.hideOrUnhideControl("Subgrid_new_14", false);
    helper.hideOrUnhideControl("Subgrid_new_15", false);
    helper.hideOrUnhideControl("Subgrid_new_17", true);
}