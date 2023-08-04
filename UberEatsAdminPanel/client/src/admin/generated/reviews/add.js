import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import IMDatePicker from '../../ui/IMDatePicker';
import { IMLocationPicker } from '../../ui/IMLocationPicker';
import { IMTypeaheadComponent, IMObjectInputComponent, IMMultimediaComponent, IMArrayInputComponent, IMColorPicker, IMColorsContainer, IMColorBoxComponent, IMStaticMultiSelectComponent, IMStaticSelectComponent, IMPhoto, IMModal, IMToggleSwitchComponent } from '../../../common';
import { Card, CardBody } from "reactstrap";
/* Insert extra imports here */
import IMReviewsRestaurantTypeaheadComponent from '../ui/IMReviewsRestaurantTypeaheadComponent.js'

import IMReviewsAuthorTypeaheadComponent from '../ui/IMReviewsAuthorTypeaheadComponent.js'


import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const AddNewReviewsView = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        setModifiedNonFormData({ createdAt: new Date()})
    }, []);

    const createReviews = async (data, setSubmitting) => {
        console.log(JSON.stringify(data));
        setIsLoading(true);
        const response = await fetch(baseAPIURL + 'review/add', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, ...modifiedNonFormData}) // body data type must match "Content-Type" header
        });
        setSubmitting(false);
        setIsLoading(false);
    }

    const onTypeaheadSelect = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const onMultipleTypeaheadSelect = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const onMultipleTypeaheadDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice(index, 1)
        setModifiedNonFormData(newData)
    }

    const handleSwitchChange = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = value ^ true;
        setModifiedNonFormData(newData)
    }

    const handleSelectChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const handleColorChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const handleColorDelete = (fieldName) => {
        var newData = {...modifiedNonFormData}
        delete newData[fieldName]
        setModifiedNonFormData(newData)
    }

    const handleColorsChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const handleColorsDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice(index, 1)
        setModifiedNonFormData(newData)
    }

    const handleArrayInput = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const handleArrayDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice(index, 1)
        setModifiedNonFormData(newData)
    }

    const handleObjectInput = (key, value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName][key] = value
        } else {
            newData[fieldName] = { [key]: value }
        }
        setModifiedNonFormData(newData)
    }

    const handleObjectDelete = (key, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = Object.keys(newData[fieldName]).reduce((object, keys) => {
            if (keys !== key) {
              object[keys] = newData[fieldName][keys]
            }
            return object
          }, {})
        setModifiedNonFormData(newData)
    }

    const onDateChange = (toDate, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = toDate
        setModifiedNonFormData(newData)
    }

    const onLocationChange = (addressObject, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (!addressObject || !addressObject.location || !addressObject.gmaps) {
            return
        }
        const location = {
            longitude: addressObject.location.lng,
            latitude: addressObject.location.lat,
            address: addressObject.label,
            placeID: addressObject.placeId,
            detailedAddress: addressObject.gmaps.address_components
        }
        newData[fieldName] = location
        setModifiedNonFormData(newData)
    }

    const onSimpleLocationChange = (addressObject, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (!addressObject || !addressObject.location) {
            return
        }
        const location = {
            lng: addressObject.location.lng,
            lat: addressObject.location.lat,
            // address: addressObject.label,
        }
        newData[fieldName] = location
        setModifiedNonFormData(newData)
    }

    const handleImageUpload = (event, fieldName, isMultiple) => {
        const files = event.target.files
        const formData = new FormData()
        for (var i = 0; i < files.length; ++i) {
            formData.append('photos', files[i])
        }

        fetch(baseAPIURL + 'upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(response => {
            var newData = {...modifiedNonFormData}
            if (!isMultiple) {
                const url = response.data && response.data[0] && response.data[0].url
                newData[fieldName] = url
            } else {
                // multiple photos
                const urls = response.data && response.data.map(item => item.url)
                if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
                    newData[fieldName] = urls
                } else {
                    newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
                }
            }
            setModifiedNonFormData(newData)
            console.log(response)
        })
        .catch(error => {
          console.error(error)
        })
    }

    const handleDeletePhoto = (srcToBeRemoved, fieldName, isMultiple) => {
        if (isMultiple) {
            var newData = {...modifiedNonFormData}
            var currentURLs = newData[fieldName]
            if (currentURLs) {
                const newURLs = currentURLs.filter(src => src != srcToBeRemoved)
                newData[fieldName] = newURLs
                setModifiedNonFormData(newData)
            }
        } else {
            var newData = {...modifiedNonFormData}
            newData[fieldName] = null
            setModifiedNonFormData(newData)
        }
    }

    const handleMultimediaUpload = (event, fieldName, isMultiple) => {
        const files = event.target.files
        const formData = new FormData()
        for (var i = 0; i < files.length; ++i) {
            formData.append('multimedias', files[i])
        }

        fetch(baseAPIURL + 'uploadMultimedias', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(response => {
            var newData = {...modifiedNonFormData}
            if (!isMultiple) {
                const url = response.data && response.data[0] && response.data[0].url
                newData[fieldName] = url
            } else {
                // multiple media
                const data = response.data && response.data.map(item => {return { url: item.url, mime: item.mimetype } })
                if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
                    newData[fieldName] = data
                } else {
                    newData[fieldName] = [...modifiedNonFormData[fieldName], ...data]
                }
            }
            setModifiedNonFormData(newData)
            console.log(response)
        })
        .catch(error => {
          console.error(error)
        })
    }

    const handleMultimediaDelete = (srcToBeRemoved, fieldName, isMultiple) => {
        if (isMultiple) {
            var newData = {...modifiedNonFormData}
            var currentData = newData[fieldName]
            if (currentData) {
                const finalData = currentData.reduce((arrayAcumulator, curVal) => {
                    if (srcToBeRemoved !== curVal.url) {
                        arrayAcumulator.push(curVal);
                    }
                    return arrayAcumulator;
                })
                newData[fieldName] =  finalData;
                setModifiedNonFormData(newData)
            }
        } else {
            var newData = {...modifiedNonFormData}
            newData[fieldName] = null
            setModifiedNonFormData(newData)
        }
    }

    if (isLoading) {
        return (
            <div className="sweet-loading card">
                <div className="spinner-container">
                    <ClipLoader
                        className="spinner"
                        sizeUnit={"px"}
                        size={50}
                        color={'#123abc'}
                        loading={isLoading}
                    />
                </div>
            </div> 
        )
    }

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>Create New Reviews</h1>
            <Formik
                initialValues={{}}
                validate={values => {
                    values = {...values, ...modifiedNonFormData};
                    const errors = {};
                    {/* Insert all form errors here */}
        if (!values.authorID) {
            errors.authorID = 'Field Required!'
        }

        if (!values.entityID) {
            errors.entityID = 'Field Required!'
        }

        if (!values.text) {
            errors.text = 'Field Required!'
        }

        if (!values.rating) {
            errors.rating = 'Field Required!'
        }

        if (!values.createdAt) {
            errors.createdAt = 'Field Required!'
        }


                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    createReviews(values, setSubmitting);
                }}
            >
                {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
                /* and other goodies */
                }) => (
                <form onSubmit={handleSubmit}>
                    {/* Insert all add form fields here */}
        <div className="FormFieldContainer">
            <label className="FormLabel">Author</label>
            <IMReviewsAuthorTypeaheadComponent onSelect={(value) => onTypeaheadSelect(value, "authorID")} id={originalData && originalData.authorID} name={originalData && originalData.authorID} />
        </div>
    

        <div className="FormFieldContainer">
            <label className="FormLabel">Restaurant</label>
            <IMReviewsRestaurantTypeaheadComponent onSelect={(value) => onTypeaheadSelect(value, "entityID")} id={originalData && originalData.entityID} name={originalData && originalData.entityID} />
        </div>
    

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Review</label>
                        <input
                            className="FormTextField"
                            type="text"
                            name="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.text}
                        />
                        <p className="ErrorMessage">
                            {errors.text && touched.text && errors.text}
                        </p>
                    </div>
    

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Rating</label>
                        <input
                            className="FormTextField"
                            type="rating"
                            name="rating"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.rating}
                        />
                        <p className="ErrorMessage">
                            {errors.rating && touched.rating && errors.rating}
                        </p>
                    </div>
    

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Date</label>
                        <IMDatePicker
                            selected={modifiedNonFormData.createdAt}
                            onChange={(toDate) => onDateChange(toDate, "createdAt")}
                        />
                    </div>
    


                    <div className="FormActionContainer">
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Create review
                        </button>
                    </div>
                </form>
                )}
            </Formik>
        </CardBody>
        </Card>
    )
}
  
export default AddNewReviewsView;