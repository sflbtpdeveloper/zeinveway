// const cds = require('@sap/cds');
import cds from '@sap/cds';
export default cds.service.impl(async function() {
	const { TransData,UpdateTranspDataType  } = this.entities;
	const service = await cds.connect.to('transporterdata');
	this.on('READ', TransData, request => {
		return service.tx(request).run(request.query);
	});

	 this.on(['CREATE', 'UPDATE', 'DELETE'], UpdateTranspDataType,
        req => service.tx(req).run(req.query));

});