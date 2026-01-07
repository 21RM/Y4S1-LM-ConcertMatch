# ConcertMatch Algorithm Prototype

This directory contains the mock algorithm implementation for ConcertMatch.

## Prerequisites

You need Python 3 installed. The UI requires the following libraries:

```bash
pip install -r requirements.txt
```

## How to Run

### Debug UI (Recommended)
The easiest way to explore the data and algorithm is using the Streamlit dashboard:

```bash
streamlit run ui.py
```

### Helper Scripts
We provide helper scripts to launch the UI easily:
- **Windows**: Double-click `run_ui.bat`.
- **Linux/macOS**: Run `./run_ui.sh`.

### Command Line Scripts
You can also run the scripts individually:

- **Generate Data**: Defaults to 100,000 mock users.
  ```bash
  python3 generate_data.py
  ```
- **Match Users**: Runs matching for the first user in the database.
  ```bash
  python3 match_users.py [optional_user_id]
  ```

## Algorithm Logic

The matching algorithm calculates a "True Match Score" used for sorting recommendations, based on music affinity and location proximity.

### 1. Music Affinity ($S_{\text{music}}$)
We calculate a weighted Jaccard index between the users' top artists and genres. Artists are weighted higher ($70\%$) than genres ($30\%$).

$$
S_{\text{music}} = 0.7 \cdot \frac{|A_1 \cap A_2|}{|A_1 \cup A_2|} + 0.3 \cdot \frac{|G_1 \cap G_2|}{|G_1 \cup G_2|}
$$

*Where $A$ is the set of Artists and $G$ is the set of Genres.*

### 2. Location Factor ($L(d)$)
Proximity acts as a decay factor. Users share a "perfect" location score if they are within 20km. This decays linearly until 500km, after which the factor is 0.

$$
L(d) =
\begin{cases}
1 & \text{if } d \le 20\text{km} \\
\max(0, 1 - \frac{d - 20}{480}) & \text{if } d > 20\text{km}
\end{cases}
$$

### 3. True Match Score ($S_{\text{true}}$)
The final score used for sorting results. It applies the location factor to the music score, **unless** the music match is exceptionally high ($>85\%$), in which case we ignore distance (the "Perfect Match" exception).

$$
S_{\text{true}} =
\begin{cases}
S_{\text{music}} & \text{if } S_{\text{music}} > 0.85 \\
S_{\text{music}} \cdot L(d) & \text{otherwise}
\end{cases}
$$
