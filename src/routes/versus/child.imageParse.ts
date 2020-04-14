const fs = require('fs');

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
            fs.writeFile(`public/story_${person}_${key}.img`, contents, 'base64', (err) => {
                if (err) throw err;
                console.log(`public/story_${person}_${key}.img file saved`);
            });
            myStories[key] = `public/story_${person}_${key}.img`;
        }
    }
    return myStories;
};

const illustrationParse = (person, image) => {
    const contents = image.split(',')[1];

    fs.writeFile(`public/${person}_illustration.img`, contents, 'base64', (err) => {
        if (err) throw err;
        console.log(`public/{person}_illustration.img file saved`);
    });
    return `public/${person}_illustration.img`;
};
export { storyParse, illustrationParse };
