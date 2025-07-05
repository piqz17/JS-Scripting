const XRMHelperClass = require('./../classHelper');


var helper = null;

function onLoadEvent(eContext) {
    'use strict';
    helper = new XRMHelperClass(eContext); // Initialize helper class
    embeddContactRevenue();   
}


async function embeddContactRevenue() {

	var recordId = helper.getCurrentFormGUID();
	console.log(recordId);

    if (recordId) {
		recordId = recordId.replace("{", "").replace("}", ""); // Clean up the GUID
		// Base Power BI report URL (Updated URL)
		var baseUrl = "https://app.powerbi.com/reportEmbed?reportId=34b3fff1-47aa-43aa-9349-8b197a48e2eb&autoAuth=true&ctid=15e4d355-dedb-4aae-93dc-c687cb774cec";
			
		// Apply filter to show Opportunities related to the current Contact
		
		var filter2 = "&$filter=opportunity/parentcontactid eq '" + recordId + "'";


		// Deal Table
		let contactId = await helper.getOtherEntityData("opportunity", "?$filter=parentcontactid eq " + recordId);
		if (contactId.length > 0) {
			
			//set account guid variable
			let parentAccountId = contactId[0].parentaccountid;
			
			// Account table
			if (parentAccountId) {
			let accountId = await helper.getOtherEntityData("account", "?$filter=accountid eq " + parentAccountId[0].id);
				if (accountId.length > 0) {
					//var accountNumber = helper.getFieldData("accountnumber");
					let accountNumber = accountId[0].accountnumber

					var filter1 = "&$filter=ItemSalesByCustomer/CustomerNo eq '" + accountNumber + "'";
				}
			}
				
		}

		// Combine filters using 'and' or 'or' based on your requirement
		var combinedFilter = "&$filter=" + filter1 + " and " + filter2;

		// Concatenate the combined filter with the base URL
		var fullUrl = baseUrl + combinedFilter;

		// Set the IFrame source dynamically with the full URL using helper class
		helper.setSrc("IFRAME_new_1", fullUrl); // Set the IFrame source


	}
		
}



