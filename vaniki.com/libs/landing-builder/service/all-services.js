angular.module('landingBuilder')
.service('editorInputSamples', function(validationRules) {
    /* jshint -W101 */
    var service = [
        {
            label: 'First Name',
            type: 'text-input',
            unique: true,
            name: 'firstName',
            required: true
        },
        {
            label: 'Last Name',
            type: 'text-input',
            unique: true,
            name: 'lastName',
            required: true
        },
        {
            label: 'Title',
            type: 'select-input',
            unique: true,
            name: 'title',
            required: true,
            values: 'Select Title:\nMr\nMrs\nMs\nMiss'
        },
        {
            label: 'Telephone',
            type: 'number-input',
            unique: true,
            name:'phone',
            required: true,
            validation: 'ukTelephone'
        },
        {
            label: 'Email',
            type: 'text-input',
            unique: true,
            name: 'email',
            required: true,
            validation: 'email'
        },
        {
            label: 'Date of birth',
            type: 'custom-dob',
            unique: true,
            name: 'birthDate',
            required: true
        },
        {
            label: 'Date of birth US',
            type: 'custom-dob-us',
            unique: true,
            name: 'birthDate',
            required: true
        },
        {
            label: 'Address US',
            type: 'custom-address',
            unique: true,
            name: 'addressLine',
            required: true,
            validation: 'usAddress'
        },
        {
            label: 'Postcode',
            type: 'custom-postcode',
            unique: true,
            name: 'postcode',
            required: true,
            validation: 'ukPostcode'
        },
        {
            label: 'Policy',
            type: 'custom-policy',
            unique: true,
            name: 'terms',
            required: true,
            text: 'I have read and agree to the <a data-toggle="modal" href="../../prizedrawrules" data-target="#pageModal" class="ng-scope">Prize Draw Rules</a>, <a data-toggle="modal" href="../../terms" data-target="#pageModal" class="ng-scope">Terms &amp; Conditions</a>, <a data-toggle="modal" href="../../cookies" data-target="#pageModal" class="ng-scope">Vaniki Cookie Policy</a>  and <a data-toggle="modal" href="../../policy" data-target="#pageModal" class="ng-scope">Privacy Policy</a> and agree to be contacted by mail, telephone, email or SMS by one of our <a data-toggle="modal" href="../../Sponsors" data-target="#pageModal" class="ng-scope">Sponsors</a>.'
        },

        {
            type: 'text-block',
            text: 'This is some text block to display some info. This is some text block to display some info.This is some text block to display some info. This is some text block to display some info.'
        },
        {
            type: 'image-block',
            img: ''
        },
        {
            label: 'Custom Text/Telephone/Number/Email input',
            type: 'text-input'
        },
        {
            label: 'Custom checkbox',
            type: 'checkbox-input',
            values: 'option 1\noption 2'
        },
        {
            label: 'Custom select',
            type: 'select-input',
            values: 'Please select:\noption 1\noption 2'
        },
        {
            label: 'Custom radio',
            type: 'radio-input',
            values: 'option 1\noption 2'
        },
        {
            label: 'Custom date',
            type: 'date-input'
        },
        {
            label: 'Item List',
            type: 'item-list',
            values: [
                {
                    name: 'item1',
                    images: []
                },
                {
                    name: 'item2',
                    images: []
                }
            ]
        },
        {
            label: 'Submit button',
            type: 'submit-button'
        }
    ];
    /* jshint +W101 */

    return service;
})
.service('pageObject', function() {

    var service = {
        getObject: getObject,
        updateEditableForm: updateEditableForm
    };

    var pageObject = {
        formModel: {},
        settings: {},
        styles: {},
        content: {},
        html: '',
        pageCSS: '',
        templateCSS: '',
        assets: {},

        formTemplate: [],
        formPage: [],
        formCombined: [],
        editableForm: [],
        item: {}
    };

    var pageAndTemplateObjects = pageData; //fetch the data from php echo on the page
    combineTemplateAndPage();
    setFormToEdit();
    getImagesById();

    return service;

    function getImagesById() {
        var variablesList = pageObject.content;
        var imagesList = pageObject.assets.images;

        for (var varIndex in variablesList) {
            if (variablesList[varIndex].type === 'image') {
                for (var imgIndex in imagesList){
                    if (variablesList[varIndex].id === imgIndex) {
                        variablesList[varIndex].value = imagesList[imgIndex].src;
                        variablesList[varIndex].preview = imagesList[imgIndex].preview;
                        break;
                    }
                }
            }
        }
    }

    //function to combine template and page objects
    function combineTemplateAndPage () {
        var template = pageAndTemplateObjects.objectData.template || {};
        var page = pageAndTemplateObjects.objectData.page || {};
        pageObject.formModel = pageAndTemplateObjects.formDataModel;

        pageObject.settings = {};
        pageObject.settings.mode = pageData.objectType || 'preview';
        pageObject.settings.objectId = pageData.objectId;
        pageObject.settings.ip = pageData.ip || '';
        if (page.templateId) {
            pageObject.settings.templateId = page.templateId;
        }

        // merge images lists
        page.assets = page.assets || {};
        page.assets.images = page.assets.images || {};
        template.assets = template.assets || {};
        template.assets.images = template.assets.images || {};
        pageObject.assets.images = pageObject.assets.images || {};
        mergeOptions(template.assets.images, page.assets.images, pageObject.assets.images);

        pageObject.html = template.html  || '';
        pageObject.templateCSS = template.CSS  || '';
        pageObject.pageCSS = page.CSS  || '';

        pageObject.formTemplate = template.form || [];
        pageObject.formPage = page.form || [];

        updateEditableForm();

        //add the page form inputs to the template inputs
        pageObject.content = mergeOptions(template.content, page.content, pageObject.content);
        pageObject.styles = mergeOptions(template.styles, page.styles, pageObject.styles);

        return pageObject;
    }

    /*jshint -W089*/
    /* @toDo - replase with angular.extend */
    function mergeOptions(obj1, obj2, destinationObj) {
        for (var attrname in obj1) {
            destinationObj[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            destinationObj[attrname] = obj2[attrname];
        }

        return destinationObj;
    }
    /*jshint +W089*/

    function setFormToEdit() {
        (pageObject.settings.mode === 'page') && (pageObject.editableForm = pageObject.formPage);
        (pageObject.settings.mode === 'template') && (pageObject.editableForm = pageObject.formTemplate);
    }

    function updateEditableForm() {
        pageObject.formCombined = [];

        pageObject.formTemplate.forEach(function(inputItem) {
            pageObject.formCombined.push(inputItem);
        });

        pageObject.formPage.forEach(function(inputItem) {
            pageObject.formCombined.push(inputItem);
        });
    }

    function getObject() {
        updateEditableForm();
        return pageObject;
    }
})
.service('lpTabs', function() {
    var tabs = {
        editor: 'fields',
        inputs: 'custom',
        editorPreview: {}
    };

    return tabs;
})
.service('validationRules', function($http) {
    var service = {
        getAllRules: getAllRules,
        getByName: getByName
    };

    var validationUrl = 'http://validation.unnik-iq.com';

    var validationRules = [
        {
            name: 'none',
            rule: '',
            messageRequired: 'This field is required',
            validationUrl: validationUrl,
            backendValOn: false
        },
        {
            name: 'number',
            rule: '^\\d+$',
            messageRequired: 'This field is required',
            messageCustomValidation: 'Please enter a number',
            messageBackendValidation: 'Server check error message',
            validationUrl: validationUrl,
            backendValOn: false
        },
        {
            name: 'lettersOnly',
            rule: '^(?!.*([A-Za-z])\1{2})[A-Za-z]+$', /*'^[a-zA-Z]+$',*/
            messageRequired: 'This field is required',
            messageCustomValidation: 'Letters only are allowed',
            messageBackendValidation: 'Server check error mesage',
            badWordsCheck: false,
            badWordsMessage: 'Invalid input',
            validationUrl: validationUrl,
            backendValOn: false
        },
        {
            name: 'email',
            rule: '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
            messageRequired: 'This field is required',
            messageCustomValidation: 'Email is invalid',
            messageBackendValidation: 'Please enter a valid email',
            validationUrl: validationUrl + '/email',
            validationParams: 'email',
            backendValOn: true
        },
        {
            name: 'ukTelephone',
            rule: '^(?:(?:\\(?(?:0(?:0|11)\\)?[\\s-]?\\(?|\\+)44\\)?[\\s-]?(?:\\(?0\\)?[\\s-]?)?)|(?:\\(?0))(?:(?:\\d{5}\\)?[\\s-]?\\d{4,5})|(?:\\d{4}\\)?[\\s-]?(?:\\d{5}|\\d{3}[\\s-]?\\d{3}))|(?:\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3,4})|(?:\\d{2}\\)?[\\s-]?\\d{4}[\\s-]?\\d{4}))(?:[\\s-]?(?:x|ext\\.?|\\#)\\d{3,4})?$',
            messageRequired: 'This field is required',
            messageCustomVallidation: 'Your telephone is invaid',
            messageBackendValidation: 'Please enter a valid telephone',
            validationParams: 'telephone',
            validationUrl: validationUrl + '/telephone?country=UK',
            backendValOn: true
        },
        {
            name: 'usTelephone',
            rule: '^1?[2-9][0-9]{9}$',
            messageRequired: 'This field is required',
            messageCustomValidation: 'Your telephone is invaid',
            messageBackendValidation: 'Please enter a valid telephone',
            validationParams: 'telephone',
            validationUrl: validationUrl + '/telephone?country=US',
            backendValOn: true
        },
        {
            name: 'ukPostcode',
            rule: '^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
            messageRequired: 'This field is required',
            messageCustomValidation: 'Invalid Postcode',
            messageBackendValidation: 'Postcode doesn\'t exists',
            messageSelectAddress: 'Don\'t Forget To Look Up Address',
            validationUrl: validationUrl + '/postcode', //http://www.e-win.org.uk/validate.php'
            backendValOn: true
        },
        {
            name: 'usAddress',
            rule: '',
            messageRequired: 'This field is required',
            messageCustomValidation: 'Invalid address',
            messageBackendValidation: 'Postcode doesn\'t exists',
            messageSelectAddress: 'Don\'t Forget To Look Up Address',
            messageUsAddress: 'Invalid us address',
            validationUrl: validationUrl,
            backendValOn: false
        }
    ];

    function getAllRules() {
        return validationRules;
    }

    function getByName(name) {
        for (var index in validationRules) {
            if (name === validationRules[index].name) {
                return validationRules[index];
            }
        }

        return false;
    }

    return service;
})
.service('pageFonts', function() {
    var service = [
        {name: 'Arial', value:'Arial, Helvetica, sans-serif'},
        {name: 'Times New Roman', value: '"Times New Roman", Times, serif'},
        {name: 'Arial Black', value:'"Arial Black", Gadget, sans-serif'},
        {name: 'Comic Sans MS', value:'"Comic Sans MS", cursive, sans-serif'},
        {name: 'Impact', value:'Impact, Charcoal, sans-serif'},
        {name: 'Lucida Sans Unicode', value:'"Lucida Sans Unicode", "Lucida Grande", sans-serif'},
        {name: 'Tahoma', value:'Tahoma, Geneva, sans-serif'},
        {name: 'Trebuchet MS', value:'"Trebuchet MS", Helvetica, sans-serif'},
        {name: 'Verdana', value:'Verdana, Geneva, sans-serif'},
        {name: 'Georgia', value:'Georgia, serif'},
        {name: 'Palatino Linotype', value:'"Palatino Linotype", "Book Antiqua", Palatino, serif'},
        {name: 'Times New Roman', value:'"Times New Roman", Times, serif'},
        {name: 'Courier New', value:'"Courier New", Courier, monospace'},
        {name: 'Lucida Console', value:'"Lucida Console", Monaco, monospace'}
    ];

    return service;
})

.service('urlHelper', function() {
    return {
        getUrlParam: getUrlParam,
        checkMobileDevice: checkMobileDevice
    };

    function getUrlParam(name) {
        /* jshint -W101 */
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
        /* jshint +W101 */
    }

    function checkMobileDevice() {
        var check = false;
        /* jshint -W101 */
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        /* jshint +W101 */
        return check;
    }
})

.filter('split', function() {
    return function(input, splitChar) {
        return input.split(splitChar);
    };
})
.filter('regExp', function() {
    return function(reg) {
        return new RegExp(reg);
    };
})
.filter('sortInputs', function() {
    return function(inputsArray, getInputs) {
        var resultArray = [];
        inputsArray.forEach(function(item) {
            if (getInputs === 'custom' && !item.unique) {
                resultArray.push(item);
            } else if (getInputs === 'unique' && item.unique) {
                resultArray.push(item);
            }
        });

        return resultArray;
    };
})

.filter('limitFromTo', function() {
    return function (input, offset, limit) {
        if (!(input instanceof Array) && !(input instanceof String)) {
            return input;
        }

        limit = parseInt(limit,10);

        if (input instanceof String) {
            if (limit) {
                return limit >= 0 ? input.slice(offset, limit) : input.slice(limit, input.length);
            } else {
                return '';
            }
        }

        var out = [],
            i, n;

        if (limit > input.length) {
            limit = input.length;
        } else if (limit < -input.length) {
            limit = -input.length;
        }

        if (limit > 0) {
            i = offset;
            n = limit;
        } else {
            i = input.length + limit;
            n = input.length;
        }

        for (; i < n; i++) {
            out.push(input[i]);
        }

        return out;
    };
})

.service('offerInputSamples', function() {
    var service = [
        {label: 'Custom checkbox', type: 'checkbox-input', values: 'option 1\noption 2'},
        {label: 'Custom select', type: 'select-input', values: 'Please select:\noption 1\noption 2'},
        {label: 'Custom radio', type: 'radio-input', values: 'option 1\noption 2'},
        {label: 'Custom text input', type: 'text-input'},
        {type: 'text-block', text: 'This is some text block to display some info. This is some text block to display some info.This is some text block to display some info. This is some text block to display some info.'},
        {type: 'image-block', img: ''},
        {label: 'Custom date', type: 'date-input'},
        {label: 'Linkout button', type: 'linkout-button', text: 'Enter Now'},
        {type: 'iframe-block', text: '<iframe style="width: 100%; border: none; overflow: hidden;" class="ay-iframe-sb7" src="http://text2winvouchers.mobi?clickId=[clickId]" scrolling="no"></iframe>'}    ];
    return service;
})

.service('offerBoardData', function($http, $q) {
    if (!offerboardData.settings ) {
        offerboardData.settings = {
            offerBoardCSS: "",
            offerBoardHTML: ""
        }
    }

    var service = {
        getEditorData: getEditorData,
        getOfferboardPreviewData: getOfferboardPreviewData,
        offerBoardCSS: offerboardData.settings.offerBoardCSS,
        offerBoardHTML: offerboardData.settings.offerBoardHTML
    };

    /* @todo Refactor this line */
    function getEditorData() {
        return offerboardData;
    }

    function getOfferboardPreviewData(offerboardId, type, item, state) {
        if (state === 'preview' && offerboardId) {
            return $http({
                method: 'GET',
                url: '/offerboard/preview',
                params: {
                    offerboardId: offerboardId,
                    type: type,
                    item: item
                },
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then(function (response) {
                if(response.data.offerboard) {
                    var responseToString = [];
                    //convert number type to string
                    angular.forEach(response.data.offerboard, function(value) {
                        value.type = '' + value.type;
                        this.push(value);
                    }, responseToString);

                    response.data.offerboard = responseToString;
                }
                return response;
            });
        } else {
            // data from php echo on page
            var response = {};
            response.data = offerboardData;
            return $q.when(response);
        }
    }

    return service;
})
.service('userData', function() {
    var service = {
        getUserData: getUserData,
        firstName: userData.firstName
    };

    function getUserData() {
        return userData;
    }

    return service;
})

    .service('filledInputsService', function() {
        return {
            filledInputsCount: 0
        };
    })

.service('offerData', function($http, $q, urlHelper) {
    var service = {
        getOffer: getOffer,
        cloneOffer: cloneOffer,
        createOffer: createOffer,
        deleteOffer: deleteOffer,
        updateOffer: updateOffer,
        saveOffersList: saveOffersList
    };

    function getOffer(offerId) {
        if (offerId) {
            return $http({
                url: '/admin/offer/view',
                method: 'GET',
                params: {offerId: offerId, version: 1},
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        } else if (!offerId) {
            var projectId = urlHelper.getUrlParam('projectId');
            var responce = {};
            responce.data = {};
            responce.data.offer = {
                'name': 'New offer',
                'type': 0,
                'form': [],
                'projectId' : projectId,
                'version' : 1

            };
            return $q.when(responce);
        }
    }

    function cloneOffer(offer) {
        return $http({
            url: '/admin/offer/clone',
            method: 'GET',
            params: {offerId: offer.offerId, version: offer.version},
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    function createOffer(offer) {
        return $http({
            url: '/admin/offer/create',
            method: 'POST',
            data: offer,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    function updateOffer(offer) {
        return $http({
            url: '/admin/offer/update',
            method: 'POST',
            params: {offerId : offer.offerId},
            data: offer,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    function saveOffersList(offerboardId, offerList) {
        return $http({
            url: '/admin/offer-board/update',
            method: 'PUT',
            params: {offerboardId : offerboardId},
            data: offerList,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    function deleteOffer(offer) {
        return $http({
            url: '/admin/offer/delete',
            method: 'DELETE',
            params: {offerId: offer.offerId},
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    return service;
})

.service('itemsDataService', function() {
    var chosenItem;

    var service = {
        chooseItem: chooseItem,
        getChosen: getChosen
    };

    return service;

    function chooseItem(value) {
        chosenItem = value;
    }

    function getChosen() {
        return chosenItem;
    }
});