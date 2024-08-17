import { Suspense } from "react";

import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singleSeries/CastSection";
import Director from "@/components/singleSeries/Director";
import Genres from "@/components/singleSeries/Genres";
import Musician from "@/components/singleSeries/Musician";
import Rating from "@/components/singleSeries/Rating";
import ReleasedMovie from "@/components/singleSeries/ReleasedMovie";
import DownloadSection from "./DownloadSection";
import EpisodePageSkeleton from "./EpisodePageSkeleton";
import { fetchSingleEpisode } from "@/services/SeriesService";


const SingleEpisodePage = async ({ params }) => {
    const { slug: seriesId, season, episode } = params;
    const seriesData = await fetchSingleEpisode(seriesId, season, episode);

    if (!seriesData) return <EpisodePageSkeleton />;

    const { title, series, pictures, files } = seriesData;
    const { title: seriesTitle, director, release_date, genres, rotten_rating, imdb_rating, actors } = series;


    return (
        <Suspense fallback={<EpisodePageSkeleton />}>
            <main className="container pt-10 pb-20">
                <div className="w-[85%] mx-auto space-y-6">

                    <section className="bg-c-black-10 border border-c-black-15 xl:py-9 xl:px-9 md:px-5 md:py-5 px-3.5 py-3.5 rounded-2.5xl">
                        <div className="aspect-video rounded-[0.9rem] overflow-hidden">
                            <video
                                src="/images/short-video.mp4"
                                poster={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${pictures[0]}`}
                                className="w-full"
                                controls
                            />
                        </div>
                        <div className="mt-6">
                            <h1 className="text-3xl font-semibold text-white capitalize">{seriesTitle} - Episode {episode}</h1>
                            <p className="mt-2 text-lg font-medium text-c-grey-70">Season {season} - Episode {episode}</p>
                            <p className="mt-3 text-c-grey-65 text-lg">{title}</p>
                        </div>
                    </section>

                    <section className="bg-c-black-10 border border-c-black-15 xl:py-7 xl:px-7 md:px-5 md:py-5 px-3.5 py-3.5 rounded-2.5xl">

                        <h4
                            className="text-white md:text-xl text-lg font-medium lg:mb-8 md:mb-5 mb-1.5"
                        >
                            Series Info
                        </h4>

                        <Rating custom ratings={[{ source: 'IMDb', score: imdb_rating }, { source: 'Rotten Tomatoes', score: rotten_rating }]} />

                        <div className="grid grid-cols-2 gap-10 mt-8">

                            <Genres custom genres={genres} />

                            <ReleasedMovie custom year={release_date} />

                        </div>

                        <div className="grid grid-cols-2 gap-10 mt-8">

                            <Director custom director={director} />

                            <Musician custom musician={{ name: 'Kyle Dixon', country: 'USA', image: '/images/musician.jpg' }} />

                        </div>

                    </section>

                    <CastSection actors={actors} />

                    <DownloadSection files={files} seriesTitle={seriesTitle} season={season} episode={episode} />

                    <ReviewSection id={seriesId} />

                </div>
            </main>
        </Suspense>
    );
}

export default SingleEpisodePage;