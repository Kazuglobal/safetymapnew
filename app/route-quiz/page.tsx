"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl, { LngLatLike } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// import * as turf from "@turf/turf" // FIXME: removed to avoid type issues
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Car, HelpCircle, Shield, Map } from "lucide-react"
import shuffle from "lodash.shuffle"
import { addPoints } from "@/lib/gamification"
import type { DangerReport } from "@/lib/types"
import bbox from "@turf/bbox"
import bufferTurf from "@turf/buffer"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import { point as turfPoint } from "@turf/helpers"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""
mapboxgl.accessToken = MAPBOX_TOKEN

export default function RouteQuizPage() {
  const { supabase } = useSupabase()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  const [hazards, setHazards] = useState<DangerReport[]>([])
  const [startPt, setStartPt] = useState<[number, number] | null>(null)
  const [endPt, setEndPt] = useState<[number, number] | null>(null)
  const [routeLine, setRouteLine] = useState<GeoJSON.LineString | null>(null)
  const [quizList, setQuizList] = useState<DangerReport[]>([])
  const [step, setStep] = useState<"select" | "quiz" | "result">("select")
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)

  // 初回: 危険レポート取得
  useEffect(() => {
    const fetchHazards = async () => {
      const { data } = await supabase.from("danger_reports").select(
        "id, latitude, longitude, danger_type"
      )
      setHazards((data as DangerReport[]) ?? [])
    }
    fetchHazards()
  }, [supabase])

  // マップ初期化
  useEffect(() => {
    if (map.current || !mapContainer.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [139.767, 35.681], // 東京駅
      zoom: 12,
    })

    map.current.on("click", (e) => {
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat]
      if (!startPt) {
        setStartPt(lngLat)
      } else if (!endPt) {
        setEndPt(lngLat)
      }
    })
  }, [startPt, endPt])

  // マーカー表示
  useEffect(() => {
    if (!map.current) return
    let style: any
    try {
      style = map.current.getStyle()
    } catch {
      return
    }
    // clear existing markers
    ;(style.layers || []).forEach((l) => {
      if (l.id.startsWith("marker-")) {
        try {
          map.current!.removeLayer(l.id)
        } catch {}
      }
    })
    ;(style.sources as any) &&
      Object.keys(style.sources).forEach((s) => {
        if (s.startsWith("marker-")) {
          try {
            map.current!.removeSource(s)
          } catch {}
        }
      })

    const addMarker = (pt: [number, number], id: string, color: string) => {
      map.current!.addSource(id, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: pt,
              },
              properties: {},
            } as any,
          ],
        },
      })
      map.current!.addLayer({
        id,
        type: "circle",
        source: id,
        paint: {
          "circle-radius": 6,
          "circle-color": color,
        },
      })
    }
    if (startPt) addMarker(startPt, "marker-start", "#38bdf8")
    if (endPt) addMarker(endPt, "marker-end", "#f87171")
  }, [startPt, endPt])

  // ルート取得
  useEffect(() => {
    const getRoute = async () => {
      if (!startPt || !endPt) return
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startPt[0]},${startPt[1]};${endPt[0]},${endPt[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      const res = await fetch(url)
      const data = await res.json()
      const line = data.routes?.[0]?.geometry as GeoJSON.LineString
      if (!line) return
      setRouteLine(line)
    }
    getRoute()
  }, [startPt, endPt])

  // ルート描画 + クイズリスト生成
  useEffect(() => {
    if (!map.current || !routeLine) return

    // remove prior route
    if (map.current.getLayer("route-line")) {
      map.current.removeLayer("route-line")
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route")
    }
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: routeLine,
        properties: {},
      } as any,
    })
    map.current.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#4f46e5",
        "line-width": 4,
      },
    })

    // フィット
    const bounds = bbox(routeLine)
    map.current.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], {
      padding: 40,
    })

    // 50m バッファ
    const buffered = bufferTurf(routeLine, 0.05, { units: "kilometers" })
    const near = hazards.filter((h) =>
      booleanPointInPolygon(turfPoint([h.longitude, h.latitude]), buffered),
    )
    setQuizList(shuffle(near))
  }, [routeLine, hazards])

  const startQuiz = () => {
    if (quizList.length === 0) return alert("ルート付近に危険箇所がありません！別ルートで試してください。")
    setStep("quiz")
  }

  const hazardIcon = (type: string) => {
    switch (type) {
      case "traffic":
        return <Car className="h-20 w-20 text-blue-600" />
      case "crime":
        return <Shield className="h-20 w-20 text-red-600" />
      case "disaster":
        return <AlertTriangle className="h-20 w-20 text-orange-500" />
      default:
        return <HelpCircle className="h-20 w-20 text-gray-600" />
    }
  }

  const answer = async (choice: string) => {
    const current = quizList[idx]
    const correct = current.danger_type === choice
    if (correct) setScore((s) => s + 10)
    if (idx + 1 === quizList.length) {
      setStep("result")
      // ポイント付与
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) await addPoints(supabase, user.id, correct ? 10 : 0)
      } catch (e) {
        console.error(e)
      }
    } else {
      setIdx((i) => i + 1)
    }
  }

  // UI
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none p-2 bg-white border-b text-center font-bold">ルートクイズ</div>
      <div className="flex-1 flex">
        <div ref={mapContainer} className="flex-1" />
        {/* サイドパネル */}
        <div className="w-80 max-w-full border-l p-4 bg-white overflow-y-auto">
          {step === "select" && (
            <>
              <h2 className="font-medium mb-2">スタート / ゴールを選択</h2>
              <p className="text-sm mb-2">地図をクリックして 2 点を指定してください。</p>
              <ul className="text-sm mb-4">
                <li>スタート: {startPt ? `${startPt[1].toFixed(4)},${startPt[0].toFixed(4)}` : "未設定"}</li>
                <li>ゴール: {endPt ? `${endPt[1].toFixed(4)},${endPt[0].toFixed(4)}` : "未設定"}</li>
              </ul>
              <Button onClick={startQuiz} disabled={!routeLine} className="w-full">クイズ開始</Button>
            </>
          )}
          {step === "quiz" && (
            <>
              <h2 className="font-medium mb-2">問題 {idx + 1} / {quizList.length}</h2>
              <div className="flex justify-center mb-4">{hazardIcon(quizList[idx].danger_type)}</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "交通危険", value: "traffic" },
                  { label: "犯罪危険", value: "crime" },
                  { label: "災害危険", value: "disaster" },
                  { label: "その他", value: "other" },
                ].map((opt) => (
                  <Button key={opt.value} variant="outline" onClick={() => answer(opt.value)}>
                    {opt.label}
                  </Button>
                ))}
              </div>
              <Progress value={((idx + 1) / quizList.length) * 100} />
            </>
          )}
          {step === "result" && (
            <>
              <h2 className="font-medium mb-4">クイズ終了！</h2>
              <p className="text-2xl font-bold text-center mb-4">{score} 点ゲット！</p>
              <Button className="w-full" onClick={() => location.reload()}>もう一度遊ぶ</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 