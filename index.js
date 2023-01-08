var jpdbBaseUrl = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var empDBName = 'SchoolDB';
var empRelationName = 'StudentData';
var connToken = '90932470|-31949270617448481|90955394';

$('#rollno').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var rollno = $('#rollno').val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#stuname').val(record.name);
    $('#stuclass').val(record.class);
    $('#birthdate').val(record.birthdate);
    $('#address').val(record.address);
    $('#enrollmentdate').val(record.enrollmentdate);
} 

function resetForm() {
    $('#rollno').val("");
    $('#stuname').val("");
    $('#stuclass').val("");
    $('#birthdate').val("");
    $('#address').val("");
    $('#enrollmentdate').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollno').focus();
}

function validateData() {
    var rollno, stuname, stuclass, birthdate, address, enrollmentdate;
    rollno = $('#rollno').val();
    stuname = $('#stuname').val();
    stuclass = $('#stuclass').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollmentdate = $('#enrollmentdate').val();

    if (rollno === '') {
        alert('roll no missing');
        $('#rollno').focus();
        return "";
    }
    if (stuname === '') {
        alert('Student name missing');
        $('#stuname').focus();
        return "";
    }
    if (stuclass === '') {
        alert('Student class missing');
        $('#stuclass').focus();
        return "";
    }
    if (birthdate === '') {
        alert('Birthdate missing');
        $('#birthdate').focus();
        return "";
    }
    if (address === '') {
        alert('Address missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentdate === '') {
        alert('Enrollment date missing');
        $('#enrollmentdate').focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        name: stuname,
        class : stuclass,
        birhtdate : birthdate,
        address: address,
        enrollmentdate: enrollmentdate
    };

    return JSON.stringify(jsonStrObj);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#stuname').focus();
    }else if (resJsonObj.status === 200) {
        $('#rollno').prop("disabled", true);
        fillData(resJsonObj);
        
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#stuname').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollno').focus();
}

function changeData() {
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUpdateRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}
