//-----------------------------
var ckbasic = [{items:['Source','Bold','Italic','Underline','Strike','Subscript','Superscript']}];
var ckfull = [
    { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
    '/',
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
    { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
    '/',
    { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }
];
var tb=ckbasic;
var ckconfig = {startupMode:'source'};
//-----------------------------
var name, email, emailVerified, uid, uinfo={};
var firebaseConfig = {
    apiKey: "AIzaSyD8SyHAMMVV0Gtcs871LSM0tficArYX5eg",
    authDomain: "zrenix-aae2e.firebaseapp.com",
    databaseURL: "https://zrenix-aae2e.firebaseio.com",
    projectId: "zrenix-aae2e",
    storageBucket: "zrenix-aae2e.appspot.com",
    messagingSenderId: "1095365181062",
    appId: "1:1095365181062:web:db9b34e80b0572fc",
    measurementId: "G-GR8YWKSF7F"
};