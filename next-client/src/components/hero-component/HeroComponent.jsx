"use client"
import "./HeroComponent.scss"


const HeroComponent = () => {

    return (

        <ul role="tablist" className="slidey with-text">
            <li role="tab" tabIndex={0}>
                <div className="background">
                    <video muted autoPlay loop src="https://videos.pexels.com/video-files/4281310/4281310-hd_1920_1080_25fps.mp4">Source: https://www.pexels.com/video/using-a-strainer-to-loosen-flour-powder-6138108/</video>
                </div>
                <div className="foreground">
                    <div className="fg_content">
                        <h1 className="title">Happiness</h1>
                    </div>
                </div>
            </li>
            <li role="tab" tabIndex={0}>
                <div className="background">
                    <video muted autoPlay loop src="https://videos.pexels.com/video-files/4513068/4513068-uhd_4096_2160_24fps.mp4">Source: https://www.pexels.com/video/throwing-powder-on-a-flat-surface-7236816/</video>
                </div>
                <div className="foreground">
                    <div className="fg_content">
                        <h1 className="title">Freedom</h1>
                    </div>
                </div>
            </li>
            <li role="tab" tabIndex={0}>
                <div className="background">
                    <video muted autoPlay loop src="https://videos.pexels.com/video-files/30604139/13103349_1920_1080_60fps.mp4">Source: https://www.pexels.com/video/person-pouring-sauce-on-food-3769033/</video>
                </div>
                <div className="foreground">
                    <div className="fg_content">
                        <h1 className="title">Dream</h1>
                    </div>
                </div>
            </li>
            <li role="tab" tabIndex={0}>
                <div className="background">
                    <video muted autoPlay loop src="https://videos.pexels.com/video-files/8344930/8344930-uhd_3840_2160_25fps.mp4">Source: https://www.pexels.com/video/person-cutting-parsley-leaves-3191888/</video>
                </div>
                <div className="foreground">
                    <div className="fg_content">
                        <h1 className="title">Confidence</h1>
                    </div>
                </div>
            </li>
            <li role="tab" tabIndex={0}>
                <div className="background">
                    <video muted autoPlay loop src="https://videos.pexels.com/video-files/8345028/8345028-uhd_2160_3840_25fps.mp4">Source: https://www.pexels.com/video/artistic-food-presentation-on-a-wooden-board-5657049/</video>
                </div>
                <div className="foreground">
                    <div className="fg_content">
                        <h1 className="title">Status</h1>
                    </div>
                </div>
            </li>
        </ul>

    );
};

export default HeroComponent;