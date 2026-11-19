sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    const EMPTY_FORM = { Vbeln: "", Vehno: "", Transgstn: "" };

    return Controller.extend("zeinvui.controller.Main", {

        onInit: function () {
            this.getView().setModel(new JSONModel({ ...EMPTY_FORM }), "form");
        },

        onTabSelect: function (oEvent) {
            // Reload the report each time its tab is opened
            if (oEvent.getParameter("key") === "report") {
                this.onRefresh();
            }
        },

        onRefresh: function () {
            this.byId("reportTable").getBinding("items").refresh();
        },

        onClear: function () {
            this.getView().getModel("form").setData({ ...EMPTY_FORM });
        },

        onSubmit: async function () {
            const oFormModel = this.getView().getModel("form");
            const oData = oFormModel.getData();

            if (!oData.Vbeln || !oData.Vehno || !oData.Transgstn) {
                MessageBox.warning("Please fill all required fields.");
                return;
            }

            const oModel = this.getView().getModel();   // OData V4 model
            const oListBinding = oModel.bindList("/UpdateTranspDataType");
            const oContext = oListBinding.create({
                Vbeln: oData.Vbeln,
                Vehno: oData.Vehno.toUpperCase(),
                Transgstn: oData.Transgstn.toUpperCase()
            });

            this.getView().setBusy(true);
            try {
                await oContext.created();               // resolves after the POST succeeds
                MessageToast.show("Transporter details saved.");
                this.onClear();
                this.byId("tabBar").setSelectedKey("report");
                this.onRefresh();
            } catch (oError) {
                oContext.delete();                      // drop the failed transient entry
                MessageBox.error(oError.message);
            } finally {
                this.getView().setBusy(false);
            }
        }
    });
});