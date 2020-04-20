const fs = require('fs');
const path = require('path');

const storyParse = (person, stories) => {
    const { page1, page2, page3 } = stories;
    const stories1 = {
        page1,
        page2,
        page3,
    };
    // console.log('stories1', stories);
    const myStories = {
        page1: '',
        page2: '',
        page3: '',
    };

    for (let key in stories1) {
        if (stories1[key]) {
            const contents = stories1[key].split(',')[1];
            // const contents = stories[key];
            fs.writeFile(
                path.join(__dirname, '../../../', 'public', `story_${person}_${key}.jpg`),
                contents,
                'base64',
                (err) => {
                    if (err) throw err;
                    console.log(`public/story_${person}_${key}.jpg file saved`);
                }
            );
            myStories[key] = `story_${person}_${key}.jpg`;
        }
    }
    return myStories;
};

const illustrationParse = (person, image) => {
    const contents = image.split(',')[1];

    fs.writeFile(
        path.join(__dirname, '../../../', 'public', `${person}_illustration.jpg`),
        contents,
        'base64',
        (err) => {
            if (err) throw err;
            console.log(`public/{person}_illustration.jpg file saved`);
        }
    );
    return `${person}_illustration.jpg`;
};
export { storyParse, illustrationParse };
