# Admin Dashboard Boilerplate
Using this project you can implement a full working admin dashboard in minutes.

## Install
Clone the project and run

`npm install`

Make `.env` file based on `.env.sample`.

## Models
For each entity in your project you must create an interface and a model file. You can find samples here:
* `src/interfaces/project/user.interface.ts`
* `src/models/user.model.ts`

### Model structure
Each model contains these fields:
* `title`: The title that shows up in the corresponding page
* `route`: The route of the corresponding page
* `fields`: Properties of the entity and their types and options

### Field Options
* `type`: Type of the field
* `foreign`: Specifies foreign key properties:
  * `route`: API route for getting foreign reference
  * `field`: Field of foreign reference to show
* `fields`: Fields of nested fields (recursive)
* `function`: Function to run over field value
* `list`: Object of key:value for list fields
* `rows`: Number of rows for textarea fields
* `hide_in_list`: Specifies weather the field should be shown on list page
* `hide_in_item`: Specifies weather the field should be shown on item (Add / Edit) page
* `file_type`: `image` or `other`
* `image_width`: Width of image to show on item page
* `image_height`: Height of image to show on item page

### Field Types
* `text`: Simple string field
* `textarea`: Multiline text field
* `text_array`: Array of strings field
* `number`: Number field
* `date`: Just date (year, month, day) field
* `datetime`: Date and time field
* `time`: Just time (hour, minute, second) field
* `currency`: Number field, currency formatted
* `foreign`: Foreign key field (Shows reference field)
* `foreign_array`: Array of foreign keys
* `function`: Runs a function over the field and show the result
* `list`: Dropdown list with specific values
* `image`: Shows image, upload image (to `/upload` route)
* `images`: Array of images field
* `nested`: Multilevel JSON field
* `nested_array`: Array of multilevel values field
* `json`: JSON mixed field, stringify when showing, parse when sending
* `boolean`: Boolean field (show checkbox)
* `password`: Password field
* `video`: Upload video and show the thumbnail
* `video_array`: Array of videos field
* `file`: Upload any file, show download link
* `file_array`: Array of files field

## Adding Entities
To add a new entity, you must first create the interface file in `src/interfaces/project` directory and add it to the `src/interfaces/project/index.ts` file.

Then create the model file of the entity in `src/models` directory and add it to the `src/models/index.ts` file. You can specify an icon for the entity from the `react-icons` icons list here: [react-icons.github.io/react-icons](https://react-icons.github.io/react-icons)

That's it!

## Technologies
* React.js
* TypeScript
* Axios
* React Icons
* Image Crop
* Tag Input

## Creator
[Alireza Nasseh](https://alirezanasseh.github.io/)
