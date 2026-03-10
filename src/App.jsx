import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const audienceOptions = ["Gents", "Ladies", "Family"];

const emptyEvent = () => ({
  id: crypto.randomUUID(),
  title: "",
  startTime: "",
  address: "",
  speaker: "",
  organiser: "",
  audienceType: "Family",
  notes: "",
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "")
    .toLowerCase();
}

function buildMessage(events, globalDate, mood) {
  const validEvents = events.filter(
    (event) =>
      event.title ||
      event.startTime ||
      event.address ||
      event.speaker ||
      event.organiser ||
      event.notes
  );

  if (validEvents.length === 0) {
    return "Your WhatsApp message preview will appear here as you fill in the form.";
  }

  const sortedEvents = [...validEvents].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  const moodEmoji = mood === "Jashan" ? "💐💐" : "🏴🏴";
  const lines = [];
  lines.push(`${moodEmoji} *Reminder for today* ${moodEmoji}`);

  if (globalDate) {
    lines.push(`*Date:* ${formatDate(globalDate)}`);
  }

  sortedEvents.forEach((event, index) => {
    if (index !== 0) {
      lines.push("*------------------------------*");
    }

    lines.push("");

    if (event.title) {
      lines.push(`*${event.title}*`);
      lines.push("");
    }
    if (event.audienceType) lines.push(`*${event.audienceType}*`);
    if (event.startTime) lines.push(`*Time:* ${formatTime(event.startTime)}`);
    if (event.address) lines.push(`*Address:* ${event.address}`);
    if (event.speaker) lines.push(`*Khitabat:* ${event.speaker}`);
    if (event.notes) lines.push(`*Notes:* ${event.notes}`);
    lines.push("");
    if (event.organiser) lines.push(`*Organiser:* ${event.organiser}`);

    if (index === sortedEvents.length - 1) {
      lines.push("*------------------------------*");
      lines.push("");
      lines.push("*Facebook Group:* https://bit.ly/3BikVaj");
      lines.push("*Facebook Page:* https://bit.ly/3TNgtaY");
      lines.push("*Youtube Channel:* https://bit.ly/3B0Ixzc");
      lines.push("");
      lines.push("*Azadari Updates - Sydney*");
    }
  });

  return lines.join("\n");
}

export default function EventMessageMVP() {
  const [globalDate, setGlobalDate] = useState("");
  const [mood, setMood] = useState("Majlis");
  const [events, setEvents] = useState([emptyEvent()]);
  const [copyState, setCopyState] = useState("Copy WhatsApp Message");

  const previewMessage = useMemo(() => buildMessage(events, globalDate, mood), [events, globalDate, mood]);

  const updateEvent = (id, field, value) => {
    setEvents((current) => current.map((event) => (event.id === id ? { ...event, [field]: value } : event)));
  };

  const addEvent = () => {
    setEvents((current) => [...current, emptyEvent()]);
  };

  const removeEvent = (id) => {
    setEvents((current) => {
      if (current.length === 1) return [emptyEvent()];
      return current.filter((event) => event.id !== id);
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopyState("Copied!");
      setTimeout(() => setCopyState("Copy WhatsApp Message"), 1800);
    } catch {
      setCopyState("Copy failed");
      setTimeout(() => setCopyState("Copy WhatsApp Message"), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Event Message Generator</h1>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Create one or more events, preview the WhatsApp message live, and copy it instantly.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Message Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="global-date">Global date</Label>
                    <Input
                      id="global-date"
                      type="date"
                      value={globalDate}
                      onChange={(e) => setGlobalDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reminder type</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Majlis">Majlis</SelectItem>
                        <SelectItem value="Jashan">Jashan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg">Event {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEvent(event.id)}
                      aria-label={`Remove event ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`title-${event.id}`}>Event title</Label>
                        <Input
                          id={`title-${event.id}`}
                          value={event.title}
                          onChange={(e) => updateEvent(event.id, "title", e.target.value)}
                          placeholder="Quran Khwani & Majlis e Tarheem"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`time-${event.id}`}>Start time</Label>
                        <Input
                          id={`time-${event.id}`}
                          type="time"
                          value={event.startTime}
                          onChange={(e) => updateEvent(event.id, "startTime", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`address-${event.id}`}>Address</Label>
                        <Input
                          id={`address-${event.id}`}
                          value={event.address}
                          onChange={(e) => updateEvent(event.id, "address", e.target.value)}
                          placeholder="81-89 Clifton Avenue, Kemps Creek"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`speaker-${event.id}`}>Speaker</Label>
                        <Input
                          id={`speaker-${event.id}`}
                          value={event.speaker}
                          onChange={(e) => updateEvent(event.id, "speaker", e.target.value)}
                          placeholder="Maulana Syed Shoaib Naqvi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`organiser-${event.id}`}>Organiser</Label>
                        <Input
                          id={`organiser-${event.id}`}
                          value={event.organiser}
                          onChange={(e) => updateEvent(event.id, "organiser", e.target.value)}
                          placeholder="MWA"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Audience type</Label>
                        <Select
                          value={event.audienceType}
                          onValueChange={(value) => updateEvent(event.id, "audienceType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience type" />
                          </SelectTrigger>
                          <SelectContent>
                            {audienceOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`notes-${event.id}`}>Notes</Label>
                        <Textarea
                          id={`notes-${event.id}`}
                          value={event.notes}
                          onChange={(e) => updateEvent(event.id, "notes", e.target.value)}
                          placeholder="Optional notes"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button onClick={addEvent} className="w-full rounded-2xl py-6 text-base">
              <Plus className="mr-2 h-4 w-4" />
              Add another event
            </Button>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl">Preview</CardTitle>
                <Button onClick={copyToClipboard} className="w-full rounded-2xl py-6 text-base sm:w-auto">
                  <Copy className="mr-2 h-4 w-4" />
                  {copyState}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="min-h-[500px] rounded-2xl bg-slate-900 p-4 text-sm leading-7 text-slate-100 shadow-inner whitespace-pre-wrap md:p-5 md:text-[15px]">
                  {previewMessage}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
