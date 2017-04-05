/* global ActiveText, GenericAPIAdaptor */
/**
 * @class SCORMIntegration
 * @memberOf ActiveText
 * @param externalSCORMAPI {*}
 * @returns {{init: init, key: string, getSCORMData: getSCORMData, gotSCORMData: gotSCORMData, setSCORMData: setSCORMData}}
 * @constructor
 */
ActiveText.SCORMIntegration = function(externalSCORMAPI) {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @private
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;

        if(externalSCORMAPI && externalSCORMAPI.callAjax && typeof(externalSCORMAPI.callAjax) === 'function') {
            /*jshint validthis:true */
            var context = this;

            var originalCallAjax = externalSCORMAPI.callAjax;
            externalSCORMAPI.callAjax = function callAjax(getOrSetOrBulkOp, n, field, dataToSend) {
                var result = originalCallAjax.apply(externalSCORMAPI, arguments);

                if(getOrSetOrBulkOp === 'bulkSet') {
                    if(String(result) === 'true') {
                        context.gotSCORMData(condenseSCORMMessage(dataToSend));
                    }
                } else if(getOrSetOrBulkOp === 'bulkGet') {
                    var parsedResult = condenseSCORMMessage(result);
                    context.gotSCORMData(parsedResult);
                }
                else {
                    debug.log('ActiveText.SCORMIntegration instance does not know how to handle operation ' +
                        getOrSetOrBulkOp + '.');
                }
            };
        }
        else {
            debug.log('ActiveText.SCORMIntegration instance was not passed an object with a method callAjax to extend.', externalSCORMAPI);
        }
    }

    function parseArray(array) {
        var obj = {};
        for(var i = 0, l = array.length; i < l; i++) {
            var property = array[i];
            if(obj[property.n] === undefined) {
                obj[property.n] = {};
            }
            obj[property.n][property.field] = property.fieldVal;
        }
        return obj;
    }

    function parseObject(input) {
        var rtn = {};
        for(var key in input) {
            var property = input[key];
            if($.isArray(property)) {
                rtn[key] = parseArray(property);
            } else if(typeof(property) === 'object') {
                rtn[key] = parseObject(property);
            }
            else {
                rtn[key] = property;
            }
        }
        return rtn;
    }

    function condenseSCORMMessage(data) {
        var rtn = {};
        var input;
        if(typeof(data) === 'string') {
            input = JSON.parse(data);
        }
        else {
            input = data;
        }

        if($.isArray(input)) {
            rtn = parseArray(input);
        } else if(typeof(input) === 'object') {
            rtn = parseObject(input);
        }
        else {
            rtn = input;
        }
        return rtn;
    }

    function getSCORMData() {
        externalSCORMAPI.callAjax('bulkGet', null, null, null);
    }

    function gotSCORMData(data) {
        $(activeTextInstance).trigger(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, data);
    }

    function setSCORMData(data) {
        externalSCORMAPI.callAjax('bulkSet', null, null, data);
    }

    return {
        init: init,
        key: 'scorm',
        getSCORMData: getSCORMData,
        gotSCORMData: gotSCORMData,
        setSCORMData: setSCORMData
    };
};