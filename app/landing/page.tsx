"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const { supabase } = useSupabase()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    
    checkSession()
    
    // セッション変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })
    
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-24 md:py-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-6 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-800 ring-1 ring-inset ring-indigo-700/20"
                >
                  🌏 2025年7月28日-31日開催
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  <span className="text-indigo-600">Culture Bridge</span><br />
                  Program 2025
                </h1>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-4 text-xl font-semibold text-indigo-700"
                >
                  🤝 高校生と留学生の国際交流プログラム
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-6 text-base leading-8 text-gray-600"
                >
                  4日間で世界とつながり、グローバルな視野を身につけよう！<br/>
                  <span className="inline-block mt-2 text-indigo-600 font-medium">� 英語実践・文化交流・プレゼンテーション</span>
                </motion.p>
                
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-y-4 sm:gap-y-0 sm:gap-x-6">
                  {isLoggedIn === null ? (
                    // ローディング中
                    <div className="rounded-md bg-gray-400 px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto">
                      読み込み中...
                    </div>
                  ) : isLoggedIn ? (
                    // ログイン済み
                    <Link
                      href="/dashboard"
                      className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full sm:w-auto"
                    >
                      ダッシュボードを見る
                    </Link>
                  ) : (
                    // 未ログイン
                    <Link
                      href="/register"
                      className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full sm:w-auto"
                    >
                      今すぐ参加申込
                    </Link>
                  )}
                  
                  <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                    プログラム詳細 <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* メインビジュアル */}
            <motion.div 
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                <div className="relative bg-white rounded-xl shadow-2xl ring-1 ring-gray-200 z-10 p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Global Connection</h3>
                    <p className="text-gray-600">Experience cross-cultural communication and make international friends</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 開催概要 */}
          <motion.div 
            className="relative mt-20 sm:mt-24 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="font-semibold text-gray-900">開催期間</div>
                <div className="text-sm text-gray-600">2025年7月28日-31日</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏫</div>
                <div className="font-semibold text-gray-900">対象</div>
                <div className="text-sm text-gray-600">高校生・留学生</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌐</div>
                <div className="font-semibold text-gray-900">形式</div>
                <div className="text-sm text-gray-600">オンライン・実践型</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎓</div>
                <div className="font-semibold text-gray-900">修了証</div>
                <div className="text-sm text-gray-600">発行予定</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 4日間の特徴 */}
      <motion.section 
        className="bg-gradient-to-b from-indigo-50 to-white py-16 sm:py-20 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">4 Days Journey</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              世界への扉を開く4日間
            </p>
            <motion.p 
              className="mt-4 sm:mt-6 text-base leading-7 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              留学生との1対1交流から始まり、最終日には英語でプレゼンテーション。<br className="hidden sm:inline" />
              段階的に国際感覚とコミュニケーション力を身につけます。
            </motion.p>
          </div>
          
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                day: "Day 1",
                title: "文化交流・自己紹介",
                desc: "留学生パートナーと出会い、お互いの文化について学びます。",
                color: "from-blue-400 to-indigo-500",
                icon: "🤝"
              },
              {
                day: "Day 2", 
                title: "英語実践・コミュニケーション",
                desc: "実際の会話を通じて英語コミュニケーション力を向上させます。",
                color: "from-indigo-400 to-purple-500",
                icon: "💬"
              },
              {
                day: "Day 3",
                title: "グローバル課題研究",
                desc: "世界の課題について調べ、解決策をグループで議論します。",
                color: "from-purple-400 to-pink-500", 
                icon: "🌍"
              },
              {
                day: "Day 4",
                title: "最終プレゼンテーション",
                desc: "学んだことを英語でプレゼンテーション。成果を発表します。",
                color: "from-pink-400 to-red-500",
                icon: "🎯"
              },
            ].map((item, i) => (
              <motion.div 
                key={item.day}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-indigo-600">{item.day}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 sm:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Features</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              充実したサポート機能
            </p>
            <p className="mt-4 sm:mt-6 text-base leading-7 text-gray-600">
              参加者一人ひとりの学習をサポートする様々な機能をご用意しています。
            </p>
          </div>
          <motion.div
            className="mt-12 sm:mt-16 grid grid-cols-1 gap-10 sm:gap-16 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {[
              {
                title: "個別ダッシュボード",
                desc: "進捗状況、課題提出、フィードバックを一画面で確認。",
                icon: "�",
              },
              {
                title: "リアルタイムチャット",
                desc: "グループメンバーや留学生とリアルタイムでコミュニケーション。",
                icon: "�",
              },
              {
                title: "ワーク提出システム",
                desc: "テキスト・画像・動画など多様な形式での課題提出が可能。",
                icon: "📝",
              },
              {
                title: "AIサポート検索",
                desc: "Gemini AIが学習リソースの検索をサポート。",
                icon: "🤖",
              },
              {
                title: "進捗トラッキング",
                desc: "学習進捗を視覚的に確認、モチベーション維持をサポート。",
                icon: "📈",
              },
              {
                title: "多言語対応",
                desc: "日本語・英語の切り替えで、より深い理解をサポート。",
                icon: "🌐",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                className="flex items-start gap-x-3 sm:gap-x-4"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="flex-shrink-0 text-2xl sm:text-3xl">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            世界とつながる第一歩を踏み出そう
          </h2>
          <p className="mt-4 sm:mt-6 text-base leading-7 text-indigo-100 sm:text-lg">
            Culture Bridge Program 2025で、新しい自分を発見しませんか？
          </p>
          <div className="mt-8 sm:mt-10 flex justify-center">
            {isLoggedIn === null ? (
              // ローディング中
              <div className="w-full sm:w-auto rounded-md bg-gray-400/50 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white">
                読み込み中...
              </div>
            ) : isLoggedIn ? (
              // ログイン済み
              <Link
                href="/dashboard"
                className="w-full sm:w-auto rounded-md bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
              >
                ダッシュボードへ
              </Link>
            ) : (
              // 未ログイン
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-md bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
              >
                参加申込を開始
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs sm:text-sm">
          <p>© 2025 Culture Bridge Program. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-x-6">
            <Link href="/terms-of-service" className="hover:text-gray-300">利用規約</Link>
            <Link href="/privacy-policy" className="hover:text-gray-300">プライバシーポリシー</Link>
            {isLoggedIn && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.reload()
                }}
                className="hover:text-gray-300"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  )
} 