# Simple poll widget for Lydiaviolet

This is a simple poll widget for [Lydia Violet](https://www.twitch.tv/lydiaviolet). During her streams she asks a lot of times for the chat to vote on something. This widget makes it easier for the chat to vote.

## Installation

To use this widget, you need to have a [StreamElements](https://streamelements.com/) account. You can then add the widget to your overlay and configure it.

How to add the widget to your overlay is explained in the [StreamElements documentation](https://streamelements.com/dashboard/overlays).

I recommend to create a new overlay for the poll widget, so you can easily add it to your stream at any scenes.

## Configuration

The widget has the following configuration options:

- Activation Command: The command that activates the poll. This command can be used by the streamer/mods only. The default is `!12`.
- Deactivation Command: The command that deactivates the poll. This command can be used by the streamer/mods only. The default is `!12stop`.
- Poll time: The duration of the poll in seconds. The default is 30 seconds.
- Progress bar width: The width of the progress bar in pixels. The default is 400 pixels. You should adjust this value to the width of your overlay.
- Fade out delay: The time in seconds the poll widget waits before fading out. The default is 10 seconds.
- Only unique: If this option is enabled, only unique votes are counted (1 user 1 vote). The default is disabled.
- Sub only: If this option is enabled, only subscribers can vote. The default is disabled.

## Usage

To start a poll, the streamer or a mod has to use the activation command. The poll will then be active for the duration of the poll time. During this time, the chat can vote by typing `!12 <pollTime> <fadeOutDelay>`. The options are separated by a space. For example, to vote with a poll time of 15 seconds and a fade out delay of 5 seconds, the user has to type `!12 15 5`. The poll time and fade out delay are optional. If they are not specified, the default values are used.

Chat members can vote simply by typing `1` or `2` in chat.

Chat can vote as often as they want. If the option "Only unique" is enabled, only unique votes are counted. If the option "Sub only" is enabled, only subscribers can vote.

The poll can be deactivated at any time by the streamer or a mod using the deactivation command.

## Examples

### Start a poll

`!12`

### Start a poll with a poll time of 15 seconds

`!12 15`

### Start a poll with a poll time of 15 seconds and a fade out delay of 5 seconds

`!12 15 5`

## Demo

You can check out a demo of the widget [here](https://www.twitch.tv/videos/1815884499?filter=archives&sort=time).
