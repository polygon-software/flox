<template>
  <q-dialog ref="dialogRef" position="bottom" seamless @hide="onDialogHide">
    <q-card style="width: 350px">
      <q-linear-progress
        :value="progress"
        animation-speed="250"
        color="primary"
      />

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">{{ songInfo.artist }}</div>
          <div class="text-grey">{{ songInfo.song }}</div>
        </div>

        <q-space />

        <q-btn flat icon="skip_previous" round @click="restart" />
        <q-btn
          :icon="playing ? 'pause' : 'play_arrow'"
          flat
          round
          @click="playPause"
        />
        <q-btn flat icon="close" round @click="stop" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { computed, ComputedRef, onMounted, onUnmounted, Ref, ref } from 'vue';

import FileEntity from 'src/flox/modules/file/entities/file.entity';

const props = withDefaults(
  defineProps<{
    autoplay?: boolean;
    file: FileEntity;
  }>(),
  {
    autoplay: false,
  }
);

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const audio = new Audio(props.file.url);

const playing: Ref<boolean> = ref(false);
const current: Ref<number> = ref(0);
const duration: Ref<number> = ref(0);
const progress: ComputedRef<number> = computed(() => {
  if (!duration.value) {
    return 0;
  }
  return current.value / duration.value;
});
const updateInterval = setInterval(() => {
  current.value = audio.currentTime;
  duration.value = audio.duration || 0;
  if (duration.value === current.value) {
    playing.value = false;
  }
}, 250);

const songInfo: ComputedRef<{ artist: string; song: string }> = computed(() => {
  const splitters = ['-', ':'];
  if (props.file.filename) {
    // eslint-disable-next-line no-restricted-syntax
    for (const splitter of splitters) {
      if (props.file.filename.includes(splitter)) {
        const split = props.file.filename.split(splitter);
        let song = split.slice(1).join(' ').trim();
        if (song.includes('.')) {
          song = song.substring(0, song.indexOf('.'));
        }
        return {
          artist: split[0].trim(),
          song,
        };
      }
    }
    return {
      artist: 'Unknown',
      song: props.file.filename,
    };
  }
  return {
    artist: 'Unknown',
    song: 'Unknown',
  };
});

/**
 * Plays/Pauses audio
 */
function playPause(): void {
  if (progress.value === 1) {
    audio.currentTime = 0;
  }
  if (playing.value) {
    audio.pause();
    playing.value = false;
  } else {
    void audio.play();
    playing.value = true;
  }
}

/**
 * Restarts the audio file
 */
function restart(): void {
  audio.currentTime = 0;
}

onUnmounted(() => {
  clearInterval(updateInterval);
});

/**
 * Stops audio
 */
function stop(): void {
  audio.pause();
  onDialogOK();
}

onMounted(() => {
  if (props.autoplay) {
    void audio.play();
    playing.value = true;
  }
});
</script>
