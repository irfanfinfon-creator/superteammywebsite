'use client'

import { motion } from 'framer-motion'
import { Tweet } from 'react-tweet'
import { Testimonial } from '@/types'

interface CommunitySectionProps {
  testimonials: Testimonial[]
}

// Helper to extract tweet ID from various X/Twitter URL formats
function getTweetId(url: string | undefined): string | null {
  if (!url) return null
  const match = url.match(/\/status\/(\d+)/)
  return match ? match[1] : null
}

export function CommunitySection({ testimonials }: CommunitySectionProps) {
  // If no testimonials from Supabase yet, provide some defaults for show
  const defaultTweetUrls = [
    "https://x.com/juiceboy_of_abj/status/2028704979737784488?s=20",
    "https://x.com/aym_al_fed/status/1890781702810480922",
    "https://x.com/Hadeeda97/status/1832049618583998953",
    "https://x.com/Bf_Haze/status/1831666633657471243",
    "https://x.com/Hadeeda97/status/1830605995252031737",
    "https://x.com/superteammy/status/1830588625904918734"
  ]

  const tweetIds = testimonials.length > 0
    ? testimonials.map(t => getTweetId(t.tweet_url)).filter(Boolean) as string[]
    : defaultTweetUrls.map(url => getTweetId(url)).filter(Boolean) as string[]

  // Duplicate for infinite scroll effect
  const doubleTweetIds = [...tweetIds, ...tweetIds]

  return (
    <section className="relative py-24 overflow-hidden bg-black/20" id="wall-of-love">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 text-gradient">
            Wall of Love
          </h2>
          <p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed font-regular">
            See what the community is saying about Superteam Malaysia. High signals, building in public, and pure vibes.
          </p>
        </motion.div>
      </div>

      {/* Sushi Roll / Marquee Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-12 mt-8">
        {/* Track 1 - Scrolling Left */}
        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap py-4 px-4 h-auto"
            whileInView={{
              x: ["0%", "-50%"],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 50,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {doubleTweetIds.map((id, index) => (
              <div key={`${id}-${index}`} className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 dark">
                <Tweet id={id} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Track 2 - Scrolling Right */}
        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap py-4 px-4 h-auto"
            whileInView={{
              x: ["-50%", "0%"],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 60,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...doubleTweetIds].reverse().map((id, index) => (
              <div key={`${id}-rev-${index}`} className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 dark">
                <Tweet id={id} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

      <style>{`
        .tweet-container iframe {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        /* Override react-tweet styles if needed */
        .react-tweet-container {
          --tweet-container-margin: 0px !important;
        }
      `}</style>
    </section>
  )
}
